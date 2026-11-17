import { ArrowLeft, Droplets, LoaderCircle, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ArbolVirtual from '../../components/nino/ArbolVirtual'
import TarjetaMisionNino from '../../components/nino/TarjetaMisionNino'
import Alert from '../../components/ui/Alert'
import { getEtapa } from '../../constants/arbol'
import { getAvatar } from '../../constants/avatares'
import { useAuth } from '../../hooks/useAuth'
import { acreditarMisionService, listarPendientesService } from '../../services/misionService'
import { listarNinosService } from '../../services/ninoService'
import { leerPorRegar, quitarPorRegar } from '../../utils/porRegar'
import { callar, hablar } from '../../utils/voz'

// Interfaz infantil (HU-07): el árbol del niño, el botón "Regar árbol" que acredita las semillas
// de las misiones confirmadas, y sus misiones en curso con audio
export default function ModoNino() {
  const { ninoId } = useParams()
  const id = Number(ninoId)
  const { user } = useAuth()
  const terminarRiego = useRef(null)

  const [nino, setNino] = useState(null)
  const [misiones, setMisiones] = useState([])
  const [porRegar, setPorRegar] = useState(() => leerPorRegar(id))
  const [loading, setLoading] = useState(true)
  const [regando, setRegando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true
    Promise.all([listarNinosService(user.id), listarPendientesService()])
      .then(([ninos, pendientes]) => {
        if (!activo) return
        setNino(ninos.find((item) => item.id === id) ?? null)
        setMisiones(pendientes.filter((item) => item.ninoId === id))
      })
      .catch(() => {
        if (activo) setError('No pudimos cargar tu árbol. Pídele ayuda a un adulto.')
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => {
      activo = false
    }
  }, [id, user.id])

  // Al salir de la pantalla se calla la voz y se detiene la animación pendiente
  useEffect(
    () => () => {
      callar()
      clearTimeout(terminarRiego.current)
    },
    [],
  )

  const semillasPorRegar = porRegar.reduce((suma, item) => suma + item.semillasRecompensa, 0)

  const saludar = () => {
    const { actual, siguiente, faltan } = getEtapa(nino.totalSemillas)
    let texto = `¡Hola ${nino.nombre}! Tu ${actual.nombre.toLowerCase()} tiene ${nino.totalSemillas} semillas.`
    if (porRegar.length > 0) texto += ' Tienes semillas para regar. ¡Toca el botón azul!'
    else if (siguiente) texto += ` Te faltan ${faltan} para ser ${siguiente.nombre.toLowerCase()}.`
    hablar(texto)
  }

  // Acredita una por una las misiones confirmadas. Si el backend responde 409 (ya acreditada)
  // o 404, la quitamos de la lista sin sumar nada: así nunca se cuentan dos veces (RN-02)
  const regar = async () => {
    setError('')
    setRegando(true)
    const etapaAntes = getEtapa(nino.totalSemillas).actual
    let total = nino.totalSemillas
    let ganadas = 0

    for (const item of porRegar) {
      try {
        const resultado = await acreditarMisionService(item.id)
        total = resultado.totalSemillas
        ganadas += resultado.semillasAcreditadas
        quitarPorRegar(id, item.id)
      } catch (err) {
        const status = err.response?.status
        if (status === 409 || status === 404) {
          quitarPorRegar(id, item.id)
        } else {
          setError('No pudimos regar tu árbol. Pídele ayuda a un adulto.')
          break
        }
      }
    }

    setNino((actual) => ({ ...actual, totalSemillas: total }))
    setPorRegar(leerPorRegar(id))

    const etapaDespues = getEtapa(total).actual
    if (etapaDespues.id !== etapaAntes.id) {
      hablar(`¡Wow! ¡Tu árbol creció! Ahora es ${etapaDespues.nombre.toLowerCase()}.`)
    } else if (ganadas > 0) {
      hablar(`¡Muy bien! Ganaste ${ganadas} semillas.`)
    }
    // Si no se sumó nada (ya estaban acreditadas) no hace falta mostrar la animación
    terminarRiego.current = setTimeout(() => setRegando(false), ganadas > 0 ? 1800 : 0)
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-eco-600">
        <LoaderCircle className="size-10 animate-spin" aria-label="Cargando" />
      </div>
    )
  }

  if (!nino) {
    return (
      <main className="mx-auto max-w-md space-y-4 px-4 py-10 text-center">
        <Alert>{error || 'No encontramos este perfil.'}</Alert>
        <Link to="/inicio" className="font-bold text-eco-700 underline">
          Volver a Mis niños
        </Link>
      </main>
    )
  }

  const avatar = getAvatar(nino.avatar)

  return (
    <main className="mx-auto min-h-svh max-w-md space-y-5 px-4 pb-10 pt-4">
      <div className="flex items-center gap-3">
        <Link
          to="/inicio"
          aria-label="Salir del modo niño"
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-eco-700 shadow-sm"
        >
          <ArrowLeft className="size-6" aria-hidden="true" />
        </Link>
        <span className={`flex size-14 shrink-0 items-center justify-center rounded-full text-3xl ${avatar.fondo}`}>
          {avatar.emoji}
        </span>
        <h1 className="min-w-0 flex-1 truncate text-2xl font-extrabold text-eco-900">¡Hola, {nino.nombre}!</h1>
        <button
          type="button"
          onClick={saludar}
          aria-label="Escuchar"
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-eco-500 text-white shadow-md active:scale-95"
        >
          <Volume2 className="size-8" aria-hidden="true" />
        </button>
      </div>

      <Alert>{error}</Alert>

      <ArbolVirtual semillas={nino.totalSemillas} regando={regando} />

      {porRegar.length > 0 ? (
        <button
          type="button"
          onClick={regar}
          disabled={regando}
          className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-sky-500 px-6 py-5 text-2xl font-extrabold text-white shadow-lg transition active:scale-95 disabled:opacity-70"
        >
          <Droplets className="size-9" aria-hidden="true" />
          Regar árbol
          <span className="rounded-full bg-white/25 px-3 py-1 text-lg">🌱 +{semillasPorRegar}</span>
        </button>
      ) : (
        <p className="rounded-3xl bg-white p-4 text-center text-lg font-bold text-gray-600">
          Cumple tus misiones para regar tu árbol 💧
        </p>
      )}

      {porRegar.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-eco-900">¡Lo lograste! ✅</h2>
          <ul className="space-y-3">
            {porRegar.map((item) => (
              <TarjetaMisionNino key={item.id} asignacion={item} porRegar />
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-extrabold text-eco-900">Mis misiones</h2>
        {misiones.length === 0 ? (
          <p className="rounded-3xl bg-white p-4 text-center font-semibold text-gray-500">
            Pídele a un adulto una nueva misión 🐸
          </p>
        ) : (
          <ul className="space-y-3">
            {misiones.map((asignacion) => (
              <TarjetaMisionNino key={asignacion.id} asignacion={asignacion} />
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}