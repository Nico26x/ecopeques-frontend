import { Volume2 } from 'lucide-react'
import { getCategoria } from '../../constants/categorias'
import { hablar } from '../../utils/voz'

// Tarjeta grande de una misión para el niño (ST-07.3). Al tocarla se lee en voz alta (ST-07.4)
export default function TarjetaMisionNino({ asignacion, porRegar = false }) {
  const categoria = getCategoria(asignacion.categoria)

  const leer = () => {
    hablar(
      porRegar
        ? `¡Cumpliste la misión ${asignacion.tituloMision}! Riega tu árbol para ganar ${asignacion.semillasRecompensa} semillas.`
        : `Tu misión es: ${asignacion.tituloMision}. Si la cumples ganas ${asignacion.semillasRecompensa} semillas.`,
    )
  }

  return (
    <li>
      <button
        type="button"
        onClick={leer}
        className={`flex w-full items-center gap-4 rounded-3xl p-4 text-left shadow-sm transition active:scale-[0.97] ${categoria.fondo}`}
      >
        <span className="text-5xl" aria-hidden="true">
          {porRegar ? '✅' : categoria.emoji}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-extrabold leading-tight text-eco-900">{asignacion.tituloMision}</span>
          <span className="mt-1 block text-base font-bold text-eco-700">🌱 +{asignacion.semillasRecompensa}</span>
        </span>
        <Volume2 className="size-8 shrink-0 text-eco-700" aria-label="Escuchar" />
      </button>
    </li>
  )
}