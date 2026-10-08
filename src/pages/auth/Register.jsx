import { GraduationCap, Lock, Mail, User, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/common/AuthLayout'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../services/authService'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ROLES = [
  { value: 'PADRE', label: 'Padre o madre', icon: Users },
  { value: 'DOCENTE', label: 'Docente', icon: GraduationCap },
]

const initialForm = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: '',
  rol: 'PADRE',
}

// Mismas reglas que valida el backend en RegisterRequest
const validate = (form) => {
  const errors = {}

  if (!form.nombre.trim()) errors.nombre = 'Escribe tu nombre'
  else if (form.nombre.trim().length > 100) errors.nombre = 'Máximo 100 caracteres'

  if (!form.apellido.trim()) errors.apellido = 'Escribe tu apellido'
  else if (form.apellido.trim().length > 100) errors.apellido = 'Máximo 100 caracteres'

  if (!form.email.trim()) errors.email = 'Escribe tu correo'
  else if (!EMAIL_REGEX.test(form.email.trim())) errors.email = 'El correo no tiene un formato válido'
  else if (form.email.trim().length > 150) errors.email = 'Máximo 150 caracteres'

  if (!form.password) errors.password = 'Escribe una contraseña'
  else if (form.password.length < 8) errors.password = 'Debe tener al menos 8 caracteres'
  else if (form.password.length > 100) errors.password = 'Máximo 100 caracteres'

  if (form.confirmPassword !== form.password) errors.confirmPassword = 'Las contraseñas no coinciden'

  return errors
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)
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
      await register({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        password: form.password,
        rol: form.rol,
      })
      navigate('/inicio', { replace: true })
    } catch (error) {
      // 409 = correo duplicado (CA-1.2), sin respuesta = backend apagado, etc.
      setServerError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="¡Únete a EcoPeques!" subtitle="Crea tu cuenta de tutor">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Alert>{serverError}</Alert>

        <fieldset>
          <legend className="mb-2 text-sm font-bold text-eco-900">Soy</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map(({ value, label, icon: Icon }) => {
              const selected = form.rol === value
              return (
                <label
                  key={value}
                  className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 px-3 py-3 text-sm font-bold transition ${
                    selected
                      ? 'border-eco-500 bg-eco-50 text-eco-700'
                      : 'border-eco-100 text-gray-500 hover:border-eco-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="rol"
                    value={value}
                    checked={selected}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Icon className="size-7" aria-hidden="true" />
                  {label}
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nombre"
            name="nombre"
            icon={User}
            value={form.nombre}
            onChange={handleChange}
            error={errors.nombre}
            autoComplete="given-name"
            placeholder="Ana"
          />
          <Input
            label="Apellido"
            name="apellido"
            icon={User}
            value={form.apellido}
            onChange={handleChange}
            error={errors.apellido}
            autoComplete="family-name"
            placeholder="Gómez"
          />
        </div>

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
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
        />

        <Input
          label="Confirmar contraseña"
          name="confirmPassword"
          type="password"
          icon={Lock}
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
        />

        <Button type="submit" loading={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-bold text-eco-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}