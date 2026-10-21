import { Send } from 'lucide-react'
import { getCategoria } from '../../constants/categorias'

// Tarjeta ilustrada de una misión del catálogo (ST-04.5).
// Si recibe onAsignar, muestra el botón "Asignar a niño" (ST-05.5)
export default function MisionCard({ mision, onAsignar }) {
  const categoria = getCategoria(mision.categoria)

  return (
    <li className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className={`flex items-center justify-between px-4 py-3 ${categoria.fondo}`}>
        <span className="text-4xl" aria-hidden="true">
          {categoria.emoji}
        </span>
        <span className={`rounded-full bg-white/70 px-3 py-1 text-xs font-extrabold ${categoria.texto}`}>
          {categoria.nombre}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-extrabold leading-tight text-eco-900">{mision.titulo}</h3>
        <p className="flex-1 text-sm text-gray-600">{mision.descripcion}</p>
        <p className="self-start rounded-2xl bg-eco-50 px-3 py-1 text-sm font-extrabold text-eco-700">
          🌱 +{mision.semillasRecompensa} semillas
        </p>
        {onAsignar && (
          <button
            type="button"
            onClick={() => onAsignar(mision)}
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl border-2 border-eco-500 px-4 py-2 font-bold text-eco-700 transition hover:bg-eco-50 active:scale-[0.98]"
          >
            <Send className="size-4" aria-hidden="true" />
            Asignar a niño
          </button>
        )}
      </div>
    </li>
  )
}