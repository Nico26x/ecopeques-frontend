import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../components/common/PrivateRoute'
import PublicRoute from '../components/common/PublicRoute'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import DashboardTutor from '../pages/tutor/DashboardTutor'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Solo sin sesión */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
        </Route>

        {/* Solo con sesión: aquí irán las demás pantallas del tutor (perfiles, misiones, etc.) */}
        <Route element={<PrivateRoute />}>
          <Route path="/inicio" element={<DashboardTutor />} />
        </Route>

        {/* Cualquier otra ruta lleva al login (y si ya hay sesión, PublicRoute lo manda a /inicio) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}