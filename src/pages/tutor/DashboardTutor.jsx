import { LoaderCircle, Plus } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import NinoCard from '../../components/ninos/NinoCard'
import NinoForm from '../../components/ninos/NinoForm'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { getNinoErrorMessage, listarNinosService } from '../../services/ninoService'

// Pantalla "Mis niños" del tutor: lista de niños a su cargo y botón para agregar uno nuevo (ST-03.6)
export default function DashboardTutor() {
  const { user } = useAuth()

  const [ninos, setNinos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  // Al entrar, pedimos al backend los niños del tutor que inició sesión
  useEffect(() => {
    let activo = true
    listarNinosService(user.id)
      .then((data) => {
        if (activo) setNinos(data)
      })
      .catch((err) => {
        if (activo) setError(getNinoErrorMessage(err))
      })
      .finally(() => {
        if (activo) setLoading(false)
      })
    return () => {
      activo = false
    }
  }, [user.id])

  const cerrarModal = useCallback(() => setModalOpen(false), [])

  const handleCreated = (nino) => {
    setNinos((current) => [...current, nino])
    setSuccess(`¡Listo! Creamos el perfil de ${nino.nombre}.`)
    setModalOpen(false)
  }

  const abrirModal = () => {
    setSuccess('')
    setModalOpen(true)
  }

  return (
    <>
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="whitespace-nowrap text-xl font-extrabold text-eco-900">Mis niños</h2>
          <div className="shrink-0">
            <Button type="button" onClick={abrirModal} className="px-4 py-2 text-base">
              <Plus className="size-5" aria-hidden="true" />
              Agregar niño
            </Button>
          </div>
        </div>

        <Alert type="success">{success}</Alert>
        <Alert>{error}</Alert>

        {loading ? (
          <div className="flex justify-center py-12 text-eco-600">
            <LoaderCircle className="size-8 animate-spin" aria-label="Cargando" />
          </div>
        ) : ninos.length === 0 && !error ? (
          <div className="rounded-3xl border-2 border-dashed border-eco-300 bg-white p-8 text-center">
            <p className="text-5xl" aria-hidden="true">🐸</p>
            <p className="mt-3 text-lg font-extrabold text-eco-900">Aún no tienes niños registrados</p>
            <p className="mt-1 text-gray-500">Agrega el primero para empezar a seguir su progreso.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {ninos.map((nino) => (
              <NinoCard key={nino.id} nino={nino} />
            ))}
          </ul>
        )}
      </main>

      <Modal open={modalOpen} title="Nuevo perfil" onClose={cerrarModal}>
        <NinoForm onCreated={handleCreated} />
      </Modal>
    </>
  )
}