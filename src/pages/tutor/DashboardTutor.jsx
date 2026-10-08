import { LogOut } from 'lucide-react'
import logo from '../../assets/logo-ecopeques.png'
import { useAuth } from '../../hooks/useAuth'

// Pantalla temporal de inicio del tutor. La completaremos en las siguientes historias de usuario
export default function DashboardTutor() {
  const { user, logout } = useAuth()

  return (
    <main className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-eco-500 to-eco-700 p-8 text-center text-white shadow-xl">
        <img src={logo} alt="" className="mx-auto size-20 rounded-full bg-white p-1" />
        <h1 className="mt-4 text-2xl font-extrabold">¡Hola, {user?.nombre}! 🌱</h1>
        <p className="mt-1 text-eco-100">
          Ingresaste como {user?.rol === 'DOCENTE' ? 'docente' : 'padre o madre'}
        </p>
        <button
          type="button"
          onClick={logout}
          className="mx-auto mt-6 flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-2 font-bold hover:bg-white/30"
        >
          <LogOut className="size-5" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </main>
  )
}