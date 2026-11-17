import { Droplets, LoaderCircle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmarMisionForm from '../../components/misiones/ConfirmarMisionForm'
import MisionPendienteCard from '../../components/misiones/MisionPendienteCard'
import Alert from '../../components/ui/Alert'
import Modal from '../../components/ui/Modal'
import { getAvatar } from '../../constants/avatares'
import { useAuth } from '../../hooks/useAuth'
import { getMisionErrorMessage, listarPendientesService } from '../../services/misionService'
import { listarNinosService } from '../../services/ninoService'
import { agregarPorRegar } from '../../utils/porRegar'

// Panel "Misiones pendientes" del tutor (ST-06.4): misiones en progreso agrupadas por niño,
// cada una con su botón para confirmar el cumplimiento (HU-06)
export default function MisionesPendientes() {
  const { user } = useAuth()

  const [pendientes, setPendientes] = useState([])
  const [ninos, setNinos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [elegida, setElegida] = useState(null)
  const [ninoParaRegar, setNinoParaRegar] = useState(null)

  // Traemos a la vez las misiones pendientes y los niños (para mostrar nombre y avatar)
  useEffect(() => {
    let activo = true
    Promise.all([listarPendientesService(), listarNinosService(user.id)])
      .then(([misiones, listaNinos]) => {
        if (!activo) return
        setPendientes(misiones)
        setNinos(listaNinos)
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
  }, [user.id])

  const buscarNino = (ninoId) => ninos.find((nino) => nino.id === ninoId)

  // Un grupo por niño, en el mismo orden de "Mis niños"
  const grupos = ninos
    .map((nino) => ({ nino, misiones: pendientes.filter((item) => item.ninoId === nino.id) }))
    .filter((grupo) => grupo.misiones.length > 0)

  const abrirConfirmacion = (asignacion) => {
    setSuccess('')
    setNinoParaRegar(null)
    setElegida(asignacion)
  }

  const cerrarConfirmacion = useCallback(() => setElegida(null), [])

  const handleConfirmada = (confirmada) => {
    const nino = buscarNino(confirmada.ninoId)
    // Queda guardada para que el niño riegue su árbol y reciba las semillas (HU-07)
    agregarPorRegar(confirmada)
    setPendientes((actuales) => actuales.filter((item) => item.id !== confirmada.id))
    setSuccess(`¡Bien hecho, ${nino?.nombre ?? 'campeón'}! Confirmamos "${confirmada.tituloMision}".`)
    setNinoParaRegar(nino ?? null)
    setElegida(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <div>
        <h2 className="text-xl font-extrabold text-eco-900">Misiones pendientes</h2>
        <p className="text-sm text-gray-500">Confirma las misiones que los niños ya cumplieron.</p>
      </div>

      <Alert type="success">{success}</Alert>
      {success && ninoParaRegar && (
        <Link
          to={`/jugar/${ninoParaRegar.id}`}
          className="flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3 font-bold text-white shadow-md transition hover:bg-sky-600"
        >
          <Droplets className="size-5" aria-hidden="true" />
          Que {ninoParaRegar.nombre} riegue su árbol
        </Link>
      )}
      <Alert>{error}</Alert>

      {loading ? (
        <div className="flex justify-center py-12 text-eco-600">
          <LoaderCircle className="size-8 animate-spin" aria-label="Cargando" />
        </div>
      ) : grupos.length === 0 && !error ? (
        <div className="rounded-3xl border-2 border-dashed border-eco-300 bg-white p-8 text-center">
          <p className="text-5xl" aria-hidden="true">✅</p>
          <p className="mt-3 text-lg font-extrabold text-eco-900">No hay misiones por confirmar</p>
          <p className="mt-1 text-gray-500">
            Asigna nuevas misiones desde el{' '}
            <Link to="/misiones" className="font-bold text-eco-700 underline">
              catálogo
            </Link>
            .
          </p>
        </div>
      ) : (
        grupos.map(({ nino, misiones }) => {
          const avatar = getAvatar(nino.avatar)
          return (
            <section key={nino.id} className="space-y-2">
              <h3 className="flex items-center gap-2 font-extrabold text-eco-900">
                <span className={`flex size-9 items-center justify-center rounded-full text-xl ${avatar.fondo}`}>
                  {avatar.emoji}
                </span>
                {nino.nombre}
                <span className="rounded-full bg-eco-100 px-2 text-sm text-eco-700">{misiones.length}</span>
              </h3>
              <ul className="space-y-3">
                {misiones.map((asignacion) => (
                  <MisionPendienteCard key={asignacion.id} asignacion={asignacion} onConfirmar={abrirConfirmacion} />
                ))}
              </ul>
            </section>
          )
        })
      )}

      <Modal open={Boolean(elegida)} title="Confirmar cumplimiento" onClose={cerrarConfirmacion}>
        {elegida && (
          <ConfirmarMisionForm
            asignacion={elegida}
            nino={buscarNino(elegida.ninoId)}
            onConfirmada={handleConfirmada}
          />
        )}
      </Modal>
    </main>
  )
}