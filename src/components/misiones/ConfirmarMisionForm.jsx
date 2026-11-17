import { Camera, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { getAvatar } from '../../constants/avatares'
import { getCategoria } from '../../constants/categorias'
import { confirmarMisionService, getConfirmacionError } from '../../services/misionService'
import { comprimirImagen } from '../../utils/imagen'
import Alert from '../ui/Alert'
import Button from '../ui/Button'

// Contenido de la ventana "Confirmar cumplimiento" (ST-06.5): foto opcional como evidencia
// y botón para marcar la misión como COMPLETADA (CA-6.1)
export default function ConfirmarMisionForm({ asignacion, nino, onConfirmada }) {
  const categoria = getCategoria(asignacion.categoria)
  const avatar = getAvatar(nino?.avatar)
  const inputRef = useRef(null)

  const [foto, setFoto] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const elegirFoto = async (event) => {
    const archivo = event.target.files?.[0]
    event.target.value = ''
    if (!archivo) return

    setProcesando(true)
    setError('')
    try {
      setFoto(await comprimirImagen(archivo))
    } catch {
      setError('No pudimos leer esa imagen. Prueba con otra foto.')
    } finally {
      setProcesando(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setEnviando(true)
    setError('')
    try {
      const confirmada = await confirmarMisionService(asignacion.id, foto)
      onConfirmada(confirmada)
    } catch (err) {
      setError(getConfirmacionError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className={`flex items-center gap-3 rounded-2xl p-3 ${categoria.fondo}`}>
        <span className="text-3xl" aria-hidden="true">
          {categoria.emoji}
        </span>
        <div className="min-w-0">
          <p className="font-extrabold leading-tight text-eco-900">{asignacion.tituloMision}</p>
          <p className="text-sm font-semibold text-eco-700">🌱 +{asignacion.semillasRecompensa} semillas</p>
        </div>
      </div>

      <p className="flex items-center gap-2 text-eco-900">
        <span className={`flex size-9 items-center justify-center rounded-full text-xl ${avatar.fondo}`}>
          {avatar.emoji}
        </span>
        <span>
          ¿<strong>{nino?.nombre ?? 'El niño'}</strong> cumplió esta misión en casa o en el salón?
        </span>
      </p>

      <Alert>{error}</Alert>

      <div>
        <p className="mb-2 text-sm font-bold text-eco-900">
          Foto de evidencia <span className="font-normal text-gray-500">(opcional)</span>
        </p>
        {foto ? (
          <div className="relative overflow-hidden rounded-2xl border-2 border-eco-100">
            <img src={foto} alt="Evidencia de la misión" className="max-h-64 w-full object-cover" />
            <button
              type="button"
              onClick={() => setFoto('')}
              className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-red-700 shadow"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Quitar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={procesando}
            className="flex w-full flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-eco-300 bg-eco-50/50 px-4 py-6 font-bold text-eco-700 transition hover:bg-eco-50 disabled:opacity-60"
          >
            <Camera className="size-8" aria-hidden="true" />
            {procesando ? 'Preparando foto...' : 'Tomar o subir una foto'}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={elegirFoto}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>

      <Button type="submit" loading={enviando} disabled={procesando}>
        {enviando ? 'Confirmando...' : 'Sí, la cumplió'}
      </Button>
    </form>
  )
}
