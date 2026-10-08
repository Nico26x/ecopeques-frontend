import API from '../config/api'

// HU-01: registra un tutor (PADRE o DOCENTE). El backend responde 201 con { id, nombre, apellido, email, rol, token }
export const registerService = async ({ nombre, apellido, email, password, rol }) => {
  const { data } = await API.post('/auth/register', { nombre, apellido, email, password, rol })
  return data
}

// HU-02: inicia sesión. El backend responde 200 con { id, nombre, apellido, email, rol, token }
export const loginService = async ({ email, password }) => {
  const { data } = await API.post('/auth/login', { email, password })
  return data
}

// Convierte un error de Axios en un mensaje claro para mostrar en pantalla
export const getErrorMessage = (error) => {
  if (!error.response) {
    return 'No se pudo conectar con el servidor. ¿Está encendido el backend?'
  }

  const { status, data } = error.response

  if (status === 401) return data?.message || 'Correo o contraseña incorrectos'
  if (status === 409) return data?.message || 'El correo ya está registrado'
  if (status === 400) return 'Revisa los datos del formulario'

  return data?.message || 'Ocurrió un error inesperado. Intenta de nuevo.'
}