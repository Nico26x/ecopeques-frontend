import { LoaderCircle, OctagonAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAvatar } from '../../constants/avatares'
import { getCategoria } from '../../constants/categorias'
import { useAuth } from '../../hooks/useAuth'
import { asignarMisionService, getAsignacionError } from '../../services/misionService'
import { getNinoErrorMessage, listarNinosService } from '../../services/ninoService'
import Alert from '../ui/Alert'
import Button from '../ui/Button'

// Contenido de la ventana "Asignar misión" (ST-05.5): elegir un niño y asignarle la misión.
// Si el niño ya tiene 3 misiones en progreso, muestra el aviso de límite (ST-05.6)
export default function AsignarMisionForm({ mision, onAsignada }) {
  const { user } = useAuth()
  const categoria = getCategoria(mision.categoria)

  const [ninos, setNinos] = useState([])
  const [ninoId, setNinoId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')
  const [limite, setLimite] = useState(false)

  // Al abrir la ventana, traemos los niños del tutor para elegir a quién asignar
  useEffect(() => {
    let activo = true
    listarNinosService(user.id)
      .then((data) => {
        if (!activo) return
        setNinos(data)
        if (data.length === 1) setNinoId(data[0].id)
      })
      .catch((err) => {
        if (activo) setError(getNinoErrorMessage(err))
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [user.id])

  const elegirNino = (id) => {
    setNinoId(id)
    setError('')
    setLimite(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!ninoId) {
      setError('Elige a qué niño le asignas la misión')
      return
    }

    setEnviando(true)
    setError('')
    setLimite(false)
    try {
      await asignarMisionService({ ninoId, misionId: mision.id })
      const nino = ninos.find((item) => item.id === ninoId)
      onAsignada({ mision, nino })
    } catch (err) {
      const { limite: esLimite, mensaje } = getAsignacionError(err)
      setLimite(esLimite)
      setError(mensaje)
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return (
      <div className="flex justify-center py-10 text-eco-600">
        <LoaderCircle className="size-8 animate-spin" aria-label="Cargando niños" />
      </div>
    )
  }

  if (ninos.length === 0 && !error) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-5xl" aria-hidden="true">🐸</p>
        <p className="font-bold text-eco-900">Primero registra a un niño para poder asignarle misiones.</p>
        <Link to="/inicio" className="inline-block font-bold text-eco-700 underline">
          Ir a Mis niños
        </Link>
      </div>
    )
  }

  const nombreElegido = ninos.find((nino) => nino.id === ninoId)?.nombre

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className={`flex items-center gap-3 rounded-2xl p-3 ${categoria.fondo}`}>
        <span className="text-3xl" aria-hidden="true">
          {categoria.emoji}
        </span>
        <div className="min-w-0">
          <p className="font-extrabold leading-tight text-eco-900">{mision.titulo}</p>
          <p className="text-sm font-semibold text-eco-700">🌱 +{mision.semillasRecompensa} semillas</p>
        </div>
      </div>

      {limite ? (
        <div role="alert" className="rounded-2xl border-2 border-orange-300 bg-orange-50 p-4 text-center">
          <OctagonAlert className="mx-auto size-10 text-orange-500" aria-hidden="true" />
          <p className="mt-2 text-lg font-extrabold text-orange-800">Límite de 3 misiones alcanzado</p>
          <p className="mt-1 text-sm text-orange-800">
            {nombreElegido} ya tiene 3 misiones en progreso. {error}
          </p>
        </div>
      ) : (
        <Alert>{error}</Alert>
      )}

      <fieldset>
        <legend className="mb-2 block text-sm font-bold text-eco-900">¿A quién se la asignas?</legend>
        <div className="space-y-2">
          {ninos.map((nino) => {
            const avatar = getAvatar(nino.avatar)
            const elegido = ninoId === nino.id
            return (
              <label
                key={nino.id}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition ${
                  elegido ? 'border-eco-500 bg-eco-50 ring-4 ring-eco-100' : 'border-eco-100 hover:bg-eco-50'
                }`}
              >
                <input
                  type="radio"
                  name="nino"
                  value={nino.id}
                  checked={elegido}
                  onChange={() => elegirNino(nino.id)}
                  className="sr-only"
                />
                <span className={`flex size-11 items-center justify-center rounded-full text-2xl ${avatar.fondo}`}>
                  {avatar.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold text-eco-900">{nino.nombre}</span>
                  <span className="block truncate text-sm text-gray-500">{nino.grupo || 'Sin grupo'}</span>
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <Button type="submit" loading={enviando}>
        {enviando ? 'Asignando...' : 'Asignar misión'}
      </Button>
    </form>
  )
}