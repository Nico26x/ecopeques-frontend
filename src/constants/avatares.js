// Avatares disponibles para los niños. En el backend se guarda solo el "id" (texto)
export const AVATARES = [
  { id: 'rana', emoji: '🐸', nombre: 'Rana', fondo: 'bg-green-100' },
  { id: 'tortuga', emoji: '🐢', nombre: 'Tortuga', fondo: 'bg-emerald-100' },
  { id: 'abeja', emoji: '🐝', nombre: 'Abeja', fondo: 'bg-yellow-100' },
  { id: 'mariposa', emoji: '🦋', nombre: 'Mariposa', fondo: 'bg-sky-100' },
  { id: 'zorro', emoji: '🦊', nombre: 'Zorro', fondo: 'bg-orange-100' },
  { id: 'buho', emoji: '🦉', nombre: 'Búho', fondo: 'bg-amber-100' },
  { id: 'pez', emoji: '🐠', nombre: 'Pez', fondo: 'bg-cyan-100' },
  { id: 'oso', emoji: '🐻', nombre: 'Oso', fondo: 'bg-rose-100' },
]

// Devuelve el avatar guardado, o la rana si el niño no tiene uno (o es uno que no conocemos)
export const getAvatar = (id) => AVATARES.find((avatar) => avatar.id === id) ?? AVATARES[0]