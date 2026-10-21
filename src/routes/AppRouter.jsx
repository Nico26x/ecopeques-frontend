import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../components/common/PrivateRoute'
import PublicRoute from '../components/common/PublicRoute'
import TutorLayout from '../components/layout/TutorLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import CatalogoMisiones from '../pages/tutor/CatalogoMisiones'
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

        {/* Solo con sesión: pantallas del tutor, todas con el mismo encabezado y menú inferior */}
        <Route element={<PrivateRoute />}>
          <Route element={<TutorLayout />}>
            <Route path="/inicio" element={<DashboardTutor />} />
            <Route path="/misiones" element={<CatalogoMisiones />} />
          </Route>
        </Route>

        {/* Cualquier otra ruta lleva al login (y si ya hay sesión, PublicRoute lo manda a /inicio) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}