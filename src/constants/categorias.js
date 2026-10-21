// Categorías ambientales de las misiones. "id" es el valor que entiende el backend (CategoriaMision)
export const CATEGORIAS = [
  {
    id: 'AGUA',
    nombre: 'Agua',
    emoji: '💧',
    fondo: 'bg-sky-100',
    texto: 'text-sky-800',
    activo: 'bg-sky-500 text-white',
  },
  {
    id: 'ENERGIA',
    nombre: 'Energía',
    emoji: '⚡',
    fondo: 'bg-amber-100',
    texto: 'text-amber-800',
    activo: 'bg-amber-500 text-white',
  },
  {
    id: 'RECICLAJE',
    nombre: 'Reciclaje',
    emoji: '♻️',
    fondo: 'bg-lime-100',
    texto: 'text-lime-800',
    activo: 'bg-lime-600 text-white',
  },
  {
    id: 'BIODIVERSIDAD',
    nombre: 'Biodiversidad',
    emoji: '🌳',
    fondo: 'bg-emerald-100',
    texto: 'text-emerald-800',
    activo: 'bg-emerald-600 text-white',
  },
]

// Devuelve los datos visuales de una categoría (o una genérica si llega una que no conocemos)
export const getCategoria = (id) =>
  CATEGORIAS.find((categoria) => categoria.id === id) ?? {
    id,
    nombre: id,
    emoji: '🌱',
    fondo: 'bg-eco-100',
    texto: 'text-eco-700',
    activo: 'bg-eco-600 text-white',
  }