import { User, Users } from 'lucide-react'
import { useState } from 'react'
import { AVATARES } from '../../constants/avatares'
import { crearNinoService, getNinoErrorMessage } from '../../services/ninoService'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'

const initialForm = { nombre: '', avatar: AVATARES[0].id, grupo: '' }

// Mismas reglas que valida el backend en NinoRequest
const validate = (form) => {
  const errors = {}

  if (!form.nombre.trim()) errors.nombre = 'Escribe el nombre del niño'
  else if (form.nombre.trim().length > 100) errors.nombre = 'Máximo 100 caracteres'

  if (form.grupo.trim().length > 100) errors.grupo = 'Máximo 100 caracteres'

  return errors
}

// Formulario para dar de alta a un niño (ST-03.5). Al guardar llama a onCreated con el niño creado
export default function NinoForm({ onCreated }) {
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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const nino = await crearNinoService({
        nombre: form.nombre.trim(),
        avatar: form.avatar,
        grupo: form.grupo.trim() || null,
      })
      setForm(initialForm)
      onCreated(nino)
    } catch (error) {
      setServerError(getNinoErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Alert>{serverError}</Alert>

      <Input
        label="Nombre del niño"
        name="nombre"
        icon={User}
        placeholder="Ej: Lucas"
        value={form.nombre}
        onChange={handleChange}
        error={errors.nombre}
        autoFocus
      />

      <fieldset>
        <legend className="mb-2 block text-sm font-bold text-eco-900">Elige su avatar</legend>
        <div className="grid grid-cols-4 gap-2">
          {AVATARES.map((avatar) => {
            const selected = form.avatar === avatar.id
            return (
              <label
                key={avatar.id}
                className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 p-2 transition ${
                  selected ? 'border-eco-500 bg-eco-50 ring-4 ring-eco-100' : 'border-transparent hover:bg-eco-50'
                }`}
              >
                <input
                  type="radio"
                  name="avatar"
                  value={avatar.id}
                  checked={selected}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className={`flex size-12 items-center justify-center rounded-full text-3xl ${avatar.fondo}`}>
                  {avatar.emoji}
                </span>
                <span className="mt-1 text-xs font-semibold text-eco-900">{avatar.nombre}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <Input
        label="Grupo o curso (opcional)"
        name="grupo"
        icon={Users}
        placeholder="Ej: Transición A"
        value={form.grupo}
        onChange={handleChange}
        error={errors.grupo}
      />

      <Button type="submit" loading={loading}>
        {loading ? 'Guardando...' : 'Guardar perfil'}
      </Button>
    </form>
  )
}