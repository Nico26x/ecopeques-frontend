// Misiones confirmadas que el niño aún no ha "regado" (semillas sin acreditar).
// Se guardan en este navegador por niño, para que el niño las riegue en su modo de juego
const CLAVE = 'ecopeques.porRegar'

const leerTodo = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? {}
  } catch {
    return {}
  }
}

const guardarTodo = (todo) => {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(todo))
  } catch {
    // Sin almacenamiento (modo privado): el niño simplemente no verá esa misión por regar
  }
}

export const leerPorRegar = (ninoId) => leerTodo()[ninoId] ?? []

export const agregarPorRegar = (asignacion) => {
  const todo = leerTodo()
  const lista = (todo[asignacion.ninoId] ?? []).filter((item) => item.id !== asignacion.id)
  const { id, tituloMision, categoria, semillasRecompensa } = asignacion
  todo[asignacion.ninoId] = [...lista, { id, tituloMision, categoria, semillasRecompensa }]
  guardarTodo(todo)
}

export const quitarPorRegar = (ninoId, asignacionId) => {
  const todo = leerTodo()
  todo[ninoId] = (todo[ninoId] ?? []).filter((item) => item.id !== asignacionId)
  guardarTodo(todo)
}