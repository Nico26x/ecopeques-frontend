import { CATEGORIAS } from '../../constants/categorias'

const TODAS = { id: '', nombre: 'Todas', emoji: '🌍', activo: 'bg-eco-600 text-white' }

// Pestañas para filtrar el catálogo por categoría ambiental (ST-04.4).
// "seleccionada" es el id de la categoría, o '' para ver todas
export default function CategoriaTabs({ seleccionada, onChange }) {
  return (
    <div role="tablist" aria-label="Filtrar por categoría" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {[TODAS, ...CATEGORIAS].map((categoria) => {
        const activa = seleccionada === categoria.id
        return (
          <button
            key={categoria.id || 'todas'}
            type="button"
            role="tab"
            aria-selected={activa}
            onClick={() => onChange(categoria.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${
              activa ? `${categoria.activo} shadow-md` : 'bg-white text-eco-900 shadow-sm hover:bg-eco-50'
            }`}
          >
            <span aria-hidden="true">{categoria.emoji}</span>
            {categoria.nombre}
          </button>
        )
      })}
    </div>
  )
}