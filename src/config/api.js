import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Adjunta el token JWT (si existe) en cada petición
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Si el token venció o no es válido, cerramos la sesión y volvemos al login.
// El backend responde 401, o 403 sin "message" cuando la petición llega sin un token válido.
// Un 403 con "message" es otra cosa (por ejemplo, ver niños de otro tutor) y se deja pasar.
// Los errores del propio login y registro también se dejan pasar para mostrarlos en el formulario
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const isAuthRequest = error.config?.url?.startsWith('/auth/')
    const tokenInvalido = status === 401 || (status === 403 && !error.response?.data?.message)
    if (tokenInvalido && !isAuthRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.assign('/login?sesion=expirada')
    }
    return Promise.reject(error)
  },
)

export default API