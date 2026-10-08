import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Register from '../pages/auth/Register'
import DashboardTutor from '../pages/tutor/DashboardTutor'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" element={<Register />} />
        <Route path="/inicio" element={<DashboardTutor />} />
        {/* Cualquier otra ruta lleva al registro (en el Paso 6 la cambiaremos a /login) */}
        <Route path="*" element={<Navigate to="/registro" replace />} />
      </Routes>
    </BrowserRouter>
  )
}