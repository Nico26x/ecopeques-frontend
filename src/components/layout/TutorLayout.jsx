import { BookOpen, LogOut, Users } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import logo from '../../assets/logo-ecopeques.png'
import { useAuth } from '../../hooks/useAuth'

const SECCIONES = [
  { to: '/inicio', label: 'Mis niños', icon: Users },
  { to: '/misiones', label: 'Misiones', icon: BookOpen },
]

// Marco común de las pantallas del tutor: encabezado verde arriba y menú de pestañas abajo.
// Cada pantalla se dibuja en el <Outlet />
export default function TutorLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-svh pb-24">
      <header className="rounded-b-[2rem] bg-gradient-to-br from-eco-500 to-eco-700 px-4 pb-8 pt-6 text-white shadow-lg">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <img src={logo} alt="" className="size-12 rounded-full bg-white p-0.5" />
          <div className="min-w-0 flex-1">
            <p className="text-sm text-eco-100">{user?.rol === 'DOCENTE' ? 'Docente' : 'Padre o madre'}</p>
            <h1 className="truncate text-2xl font-extrabold">¡Hola, {user?.nombre}! 🌱</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="flex items-center gap-2 rounded-2xl bg-white/20 px-3 py-2 text-sm font-bold hover:bg-white/30"
          >
            <LogOut className="size-5" aria-hidden="true" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      <Outlet />

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-eco-100 bg-white/95 backdrop-blur">
        <ul className="mx-auto flex max-w-2xl">
          {SECCIONES.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-3 text-xs font-bold transition ${
                    isActive ? 'text-eco-600' : 'text-gray-400 hover:text-eco-600'
                  }`
                }
              >
                <Icon className="size-6" aria-hidden="true" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}