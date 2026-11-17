import API from '../config/api'

// Trae las misiones activas del catálogo. Sin categoría trae todas;
// con categoría ('AGUA', 'ENERGIA', 'RECICLAJE' o 'BIODIVERSIDAD') el backend filtra (CA-4.1)
export const listarMisionesService = async (categoria) => {
  const params = categoria ? { categoria } : {}
  const { data } = await API.get('/misiones', { params })
  return data
}

// Convierte un error de Axios en un mensaje para mostrar al tutor
export const getMisionErrorMessage = (error) => {
  if (!error.response) {
    return 'No se pudo conectar con el servidor. ¿Está encendido el backend?'
  }
  const { status, data } = error.response
  if (status === 400) return 'La categoría elegida no es válida'
  return data?.message || 'No pudimos cargar las misiones. Intenta de nuevo'
}

// Asigna una misión a un niño del tutor (HU-05). El backend la deja EN_PROGRESO
// y no permite más de 3 misiones en progreso por niño (RN-01)
export const asignarMisionService = async ({ ninoId, misionId }) => {
  const { data } = await API.post('/misiones/asignar', { ninoId, misionId })
  return data
}

// Errores al asignar. "limite" indica que el niño ya tiene 3 misiones en progreso (CA-5.2)
export const getAsignacionError = (error) => {
  if (!error.response) {
    return { limite: false, mensaje: 'No se pudo conectar con el servidor. ¿Está encendido el backend?' }
  }
  const { status, data } = error.response
  const mensaje = data?.message || ''
  if (status === 409 && mensaje.includes('ya está asignada')) {
    return { limite: false, mensaje: 'Este niño ya tiene esta misión en progreso.' }
  }
  if (status === 409 || status === 400) {
    return { limite: true, mensaje: 'Debe completar alguna de sus misiones antes de recibir una nueva.' }
  }
  if (status === 404) return { limite: false, mensaje: 'La misión o el niño ya no existen.' }
  if (status === 403) return { limite: false, mensaje: 'No puedes asignar misiones a este niño.' }
  return { limite: false, mensaje: mensaje || 'No pudimos asignar la misión. Intenta de nuevo' }
}

// Misiones EN_PROGRESO de todos los niños del tutor, las más recientes primero (ST-06.4)
export const listarPendientesService = async () => {
  const { data } = await API.get('/misiones-ninos/tutor/pendientes')
  return data
}

// El tutor confirma que el niño cumplió la misión (CA-6.1). La evidencia es opcional:
// una URL o una foto en base64 ("data:image/..."). El backend la deja COMPLETADA
export const confirmarMisionService = async (id, evidencia) => {
  const { data } = await API.put(`/misiones-ninos/${id}/confirmar`, evidencia ? { evidencia } : {})
  return data
}

// Errores al confirmar una misión
export const getConfirmacionError = (error) => {
  if (!error.response) {
    return 'No se pudo conectar con el servidor. ¿Está encendido el backend?'
  }
  const { status, data } = error.response
  if (status === 409) return 'Esta misión ya fue confirmada. Actualiza la lista.'
  if (status === 404) return 'Esta misión ya no existe.'
  if (status === 403) return 'No puedes confirmar misiones de este niño.'
  if (status === 413) return 'La foto es muy pesada. Prueba con otra.'
  return data?.message || 'No pudimos confirmar la misión. Intenta de nuevo'
}