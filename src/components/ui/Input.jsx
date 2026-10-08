import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'

// Campo de formulario con etiqueta, ícono opcional y mensaje de error.
// Si type="password", agrega un botón para mostrar u ocultar la contraseña
export default function Input({ label, icon: Icon, error, type = 'text', ...props }) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-bold text-eco-900">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-eco-600"
            aria-hidden="true"
          />
        )}
        <input
          {...props}
          id={id}
          type={isPassword && showPassword ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-2xl border-2 bg-white py-3 text-eco-900 outline-none transition placeholder:text-gray-400 focus:border-eco-500 focus:ring-4 focus:ring-eco-100 ${
            Icon ? 'pl-11' : 'pl-4'
          } ${isPassword ? 'pr-11' : 'pr-4'} ${error ? 'border-red-400' : 'border-eco-100'}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-eco-700"
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}