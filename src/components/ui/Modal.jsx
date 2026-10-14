import { X } from 'lucide-react'
import { useEffect, useId } from 'react'

// Ventana emergente. En celular sale desde abajo y en computador queda centrada.
// Se cierra con la X, con la tecla Escape o tocando el fondo oscuro
export default function Modal({ open, title, onClose, children }) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-eco-900/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[90svh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-xl font-extrabold text-eco-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1 text-gray-500 hover:bg-eco-50 hover:text-eco-700"
          >
            <X className="size-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}