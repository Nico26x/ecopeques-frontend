import { Gamepad2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getAvatar } from '../../constants/avatares'

// Tarjeta con el avatar, nombre, grupo y semillas de un niño, y el botón para abrir su árbol (HU-07)
export default function NinoCard({ nino }) {
  const avatar = getAvatar(nino.avatar)

  return (
    <li className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <span
          className={`flex size-14 shrink-0 items-center justify-center rounded-full text-3xl ${avatar.fondo}`}
          aria-hidden="true"
        >
          {avatar.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-extrabold text-eco-900">{nino.nombre}</p>
          <p className="truncate text-sm text-gray-500">{nino.grupo || 'Sin grupo'}</p>
        </div>
        <div className="shrink-0 rounded-2xl bg-eco-50 px-3 py-1 text-center">
          <p className="text-lg font-extrabold text-eco-700">🌱 {nino.totalSemillas}</p>
          <p className="text-xs font-semibold text-eco-700">semillas</p>
        </div>
      </div>
      <Link
        to={`/jugar/${nino.id}`}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-eco-500 px-4 py-2 font-bold text-white transition hover:bg-eco-600 active:scale-[0.98]"
      >
        <Gamepad2 className="size-5" aria-hidden="true" />
        Abrir su árbol
      </Link>
    </li>
  )
}