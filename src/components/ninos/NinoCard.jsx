import { getAvatar } from '../../constants/avatares'

// Tarjeta con el avatar, nombre, grupo y semillas de un niño
export default function NinoCard({ nino }) {
  const avatar = getAvatar(nino.avatar)

  return (
    <li className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm">
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
    </li>
  )
}