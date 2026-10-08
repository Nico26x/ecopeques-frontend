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

// Si el backend responde 401 en una ruta privada, el token venció o no es válido:
// cerramos la sesión y volvemos al login. Los 401 del propio login se dejan pasar para mostrar el error
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.assign('/login?sesion=expirada')
    }
    return Promise.reject(error)
  },
)

export default API