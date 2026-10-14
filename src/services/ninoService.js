import API from '../config/api'

// Crea el perfil de un niño para el tutor que tiene la sesión iniciada.
// El backend toma el tutor del token y le asigna 0 semillas (CA-3.1)
export const crearNinoService = async ({ nombre, avatar, grupo }) => {
  const { data } = await API.post('/ninos', { nombre, avatar, grupo })
  return data
}

// Lista los niños de un tutor. Solo funciona con el id del tutor que inició sesión
export const listarNinosService = async (tutorId) => {
  const { data } = await API.get(`/ninos/tutor/${tutorId}`)
  return data
}

// Convierte un error de Axios en un mensaje para mostrar al tutor
export const getNinoErrorMessage = (error) => {
  if (!error.response) {
    return 'No se pudo conectar con el servidor. ¿Está encendido el backend?'
  }
  const { status, data } = error.response
  if (status === 400) return 'Revisa los datos del niño'
  if (status === 403) return data?.message || 'No tienes permisos para ver estos perfiles'
  return data?.message || 'Ocurrió un error. Intenta de nuevo'
}