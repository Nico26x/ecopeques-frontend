import { LoaderCircle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import AsignarMisionForm from '../../components/misiones/AsignarMisionForm'
import CategoriaTabs from '../../components/misiones/CategoriaTabs'
import MisionCard from '../../components/misiones/MisionCard'
import Alert from '../../components/ui/Alert'
import Modal from '../../components/ui/Modal'
import { getMisionErrorMessage, listarMisionesService } from '../../services/misionService'

// Catálogo de misiones ecológicas con filtro por categoría (HU-04) y asignación a un niño (HU-05)
export default function CatalogoMisiones() {
  const [categoria, setCategoria] = useState('')
  const [misiones, setMisiones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [misionElegida, setMisionElegida] = useState(null)
  const [success, setSuccess] = useState('')

  // Cada vez que cambia la categoría, pedimos al backend las misiones filtradas
  useEffect(() => {
    let activo = true
    listarMisionesService(categoria)
      .then((data) => {
        if (activo) setMisiones(data)
      })
      .catch((err) => {
        if (activo) setError(getMisionErrorMessage(err))
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => {
      activo = false
    }
  }, [categoria])

  const cambiarCategoria = (nuevaCategoria) => {
    if (nuevaCategoria === categoria) return
    setLoading(true)
    setError('')
    setCategoria(nuevaCategoria)
  }

  const abrirAsignacion = (mision) => {
    setSuccess('')
    setMisionElegida(mision)
  }

  const cerrarAsignacion = useCallback(() => setMisionElegida(null), [])

  const handleAsignada = ({ mision, nino }) => {
    setSuccess(`¡Listo! Asignamos "${mision.titulo}" a ${nino.nombre}.`)
    setMisionElegida(null)
    // Subimos al inicio para que se vea el mensaje de éxito
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <div>
        <h2 className="text-xl font-extrabold text-eco-900">Catálogo de misiones</h2>
        <p className="text-sm text-gray-500">Elige retos ecológicos para los niños a tu cargo.</p>
      </div>

      <CategoriaTabs seleccionada={categoria} onChange={cambiarCategoria} />

      <Alert type="success">{success}</Alert>
      <Alert>{error}</Alert>

      {loading ? (
        <div className="flex justify-center py-12 text-eco-600">
          <LoaderCircle className="size-8 animate-spin" aria-label="Cargando" />
        </div>
      ) : misiones.length === 0 && !error ? (
        <div className="rounded-3xl border-2 border-dashed border-eco-300 bg-white p-8 text-center">
          <p className="text-5xl" aria-hidden="true">🔍</p>
          <p className="mt-3 text-lg font-extrabold text-eco-900">No hay misiones en esta categoría</p>
          <p className="mt-1 text-gray-500">Prueba con otra pestaña.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {misiones.map((mision) => (
            <MisionCard key={mision.id} mision={mision} onAsignar={abrirAsignacion} />
          ))}
        </ul>
      )}

      <Modal open={Boolean(misionElegida)} title="Asignar misión" onClose={cerrarAsignacion}>
        {misionElegida && <AsignarMisionForm mision={misionElegida} onAsignada={handleAsignada} />}
      </Modal>
    </main>
  )
}