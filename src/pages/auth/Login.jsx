import { Lock, LogIn, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../components/common/AuthLayout'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../services/authService'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Mismas reglas que valida el backend en LoginRequest
const validate = (form) => {
  const errors = {}

  if (!form.email.trim()) errors.email = 'Escribe tu correo'
  else if (!EMAIL_REGEX.test(form.email.trim())) errors.email = 'El correo no tiene un formato válido'

  if (!form.password) errors.password = 'Escribe tu contraseña'
  else if (form.password.length < 8) errors.password = 'Debe tener al menos 8 caracteres'

  return errors
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const sessionExpired = searchParams.get('sesion') === 'expirada'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setServerError('')

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setLoading(true)
    try {
      await login({ email: form.email.trim(), password: form.password })
      // Vuelve a la página que el tutor intentaba abrir, o al inicio
      navigate(location.state?.from || '/inicio', { replace: true })
    } catch (error) {
      // 401 = correo o contraseña incorrectos (CA-2.2)
      setServerError(getErrorMessage(error))
      setForm((current) => ({ ...current, password: '' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="¡Hola de nuevo!" subtitle="Inicia sesión para seguir cuidando el planeta 🌎">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {sessionExpired && !serverError && (
          <Alert>Tu sesión expiró. Vuelve a iniciar sesión.</Alert>
        )}
        <Alert>{serverError}</Alert>

        <Input
          label="Correo electrónico"
          name="email"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          placeholder="tucorreo@ejemplo.com"
        />

        <Input
          label="Contraseña"
          name="password"
          type="password"
          icon={Lock}
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
          placeholder="Tu contraseña"
        />

        <Button type="submit" loading={loading}>
          {!loading && <LogIn className="size-5" aria-hidden="true" />}
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-bold text-eco-700 hover:underline">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}