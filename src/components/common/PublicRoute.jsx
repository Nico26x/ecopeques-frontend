import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Para Login y Registro: si el tutor ya tiene sesión, no tiene sentido mostrarlas y lo llevamos al inicio
export default function PublicRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/inicio" replace />
  }

  return <Outlet />
}