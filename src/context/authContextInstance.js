import { createContext } from 'react'

// Objeto de contexto de la sesión. Va en un archivo aparte para que la recarga en caliente de Vite funcione bien
export const AuthContext = createContext(null)