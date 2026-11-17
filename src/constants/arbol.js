// Etapas del árbol virtual según las semillas acumuladas (ST-07.5)
export const ETAPAS = [
  { id: 'brote', nombre: 'Brote', emoji: '🌱', desde: 0 },
  { id: 'planta', nombre: 'Planta', emoji: '🪴', desde: 30 },
  { id: 'arbol', nombre: 'Árbol', emoji: '🌳', desde: 80 },
]

// Devuelve la etapa actual, la siguiente (si hay) y cuánto falta para llegar a ella
export const getEtapa = (semillas = 0) => {
  const indice = ETAPAS.findLastIndex((etapa) => semillas >= etapa.desde)
  const actual = ETAPAS[indice]
  const siguiente = ETAPAS[indice + 1] ?? null
  const progreso = siguiente ? (semillas - actual.desde) / (siguiente.desde - actual.desde) : 1
  return { actual, siguiente, faltan: siguiente ? siguiente.desde - semillas : 0, progreso }
}