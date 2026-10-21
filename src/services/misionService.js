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