import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../components/common/PrivateRoute'
import PublicRoute from '../components/common/PublicRoute'
import TutorLayout from '../components/layout/TutorLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ModoNino from '../pages/nino/ModoNino'
import CatalogoMisiones from '../pages/tutor/CatalogoMisiones'
import DashboardTutor from '../pages/tutor/DashboardTutor'
import MisionesPendientes from '../pages/tutor/MisionesPendientes'

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
            <Route path="/pendientes" element={<MisionesPendientes />} />
          </Route>
          {/* Modo niño (HU-07): pantalla completa, sin el menú del tutor */}
          <Route path="/jugar/:ninoId" element={<ModoNino />} />
        </Route>

        {/* Cualquier otra ruta lleva al login (y si ya hay sesión, PublicRoute lo manda a /inicio) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}