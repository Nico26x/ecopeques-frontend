import { CalendarClock, CircleCheckBig } from 'lucide-react'
import { getCategoria } from '../../constants/categorias'

// Formato corto de fecha: "16 nov"
const formatoFecha = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' })

// Las fechas límite llegan como "2026-11-20"; se leen en hora local para no correr el día
const leerFecha = (texto) => {
  const [anio, mes, dia] = texto.slice(0, 10).split('-').map(Number)
  return new Date(anio, mes - 1, dia)
}

// Tarjeta de una misión en progreso con el botón "Confirmar cumplimiento" (ST-06.4, ST-06.5)
export default function MisionPendienteCard({ asignacion, onConfirmar }) {
  const categoria = getCategoria(asignacion.categoria)
  const asignada = leerFecha(asignacion.fechaAsignacion)
  const limite = asignacion.fechaLimite ? leerFecha(asignacion.fechaLimite) : null

  return (
    <li className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${categoria.fondo}`}
          aria-hidden="true"
        >
          {categoria.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold leading-tight text-eco-900">{asignacion.tituloMision}</p>
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
            <span>Asignada el {formatoFecha.format(asignada)}</span>
            {limite && (
              <span className="flex items-center gap-1 font-semibold text-orange-700">
                <CalendarClock className="size-4" aria-hidden="true" />
                Hasta el {formatoFecha.format(limite)}
              </span>
            )}
          </p>
        </div>
        <span className="shrink-0 rounded-2xl bg-eco-50 px-2 py-1 text-sm font-extrabold text-eco-700">
          🌱 +{asignacion.semillasRecompensa}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onConfirmar(asignacion)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-eco-500 px-4 py-2 font-bold text-eco-700 transition hover:bg-eco-50 active:scale-[0.98]"
      >
        <CircleCheckBig className="size-5" aria-hidden="true" />
        Confirmar cumplimiento
      </button>
    </li>
  )
}
