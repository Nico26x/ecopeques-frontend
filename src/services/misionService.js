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