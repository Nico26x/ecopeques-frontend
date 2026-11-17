import { getEtapa } from '../../constants/arbol'

// Árbol/mascota virtual del niño (ST-07.5): cambia de Brote a Planta a Árbol con las semillas.
// Con regando={true} caen gotas y el árbol se mueve
export default function ArbolVirtual({ semillas, regando = false }) {
  const { actual, siguiente, faltan, progreso } = getEtapa(semillas)

  return (
    <section className="rounded-[2rem] bg-gradient-to-b from-sky-100 to-eco-100 p-5 text-center shadow-sm">
      <div className="relative mx-auto flex h-52 items-end justify-center overflow-hidden">
        {regando && (
          <div className="absolute inset-x-0 top-0 flex justify-center gap-6 text-3xl" aria-hidden="true">
            <span className="animate-gota">💧</span>
            <span className="animate-gota [animation-delay:0.3s]">💧</span>
            <span className="animate-gota [animation-delay:0.6s]">💧</span>
          </div>
        )}
        <span
          key={`${actual.id}-${regando}`}
          role="img"
          aria-label={`Tu ${actual.nombre.toLowerCase()}`}
          className={`block origin-bottom text-[8rem] leading-none ${regando ? 'animate-crecer' : ''}`}
        >
          {actual.emoji}
        </span>
      </div>
      <div className="mx-auto -mt-2 h-4 w-48 rounded-full bg-amber-700/70" aria-hidden="true" />

      <p className="mt-4 text-2xl font-extrabold text-eco-900">{actual.nombre}</p>
      <p className="text-lg font-bold text-eco-700">🌱 {semillas} semillas</p>

      {siguiente ? (
        <div className="mx-auto mt-3 max-w-xs">
          <div className="h-4 overflow-hidden rounded-full bg-white" aria-hidden="true">
            <div
              className="h-full rounded-full bg-eco-500 transition-all duration-700"
              style={{ width: `${Math.round(progreso * 100)}%` }}
            />
          </div>
          <p className="mt-1 text-sm font-semibold text-gray-600">
            Faltan {faltan} semillas para ser {siguiente.emoji} {siguiente.nombre}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-sm font-semibold text-gray-600">¡Tu árbol ya es grande y fuerte!</p>
      )}
    </section>
  )
}