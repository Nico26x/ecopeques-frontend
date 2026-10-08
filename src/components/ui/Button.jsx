import { LoaderCircle } from 'lucide-react'

// Botón principal de EcoPeques. Con loading={true} muestra un spinner y se desactiva
export default function Button({ children, loading = false, disabled = false, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-eco-500 to-eco-600 px-4 py-3 text-lg font-bold text-white shadow-md transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading && <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}