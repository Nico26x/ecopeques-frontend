import { useContext } from 'react'
import { AuthContext } from '../context/authContextInstance'

// Acceso rápido a la sesión desde cualquier componente: const { user, login, logout } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return context
}