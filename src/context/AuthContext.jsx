import { useState } from 'react'
import { loginService, registerService } from '../services/authService'
import { AuthContext } from './authContextInstance'

// Lee el usuario guardado en localStorage (si existe y es válido)
const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(getStoredUser)

  // Guarda token y datos del usuario para que la sesión sobreviva al recargar la página
  const saveSession = (data) => {
    const { token: newToken, ...userData } = data
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
    return userData
  }

  // HU-02: inicia sesión con correo y contraseña
  const login = async (credentials) => saveSession(await loginService(credentials))

  // HU-01: el backend ya devuelve un token al registrarse, así que el tutor queda con sesión iniciada
  const register = async (datos) => saveSession(await registerService(datos))

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}