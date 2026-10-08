import { CircleAlert, CircleCheck } from 'lucide-react'

// Mensaje destacado para errores del servidor o confirmaciones. Si no hay mensaje, no muestra nada
export default function Alert({ type = 'error', children }) {
  if (!children) return null

  const isSuccess = type === 'success'
  const Icon = isSuccess ? CircleCheck : CircleAlert

  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${
        isSuccess ? 'border-eco-300 bg-eco-50 text-eco-700' : 'border-red-200 bg-red-50 text-red-700'
      }`}
    >
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}