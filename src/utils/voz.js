// Lee un texto en voz alta con la Web Speech API del navegador (ST-07.4)
export const vozDisponible = () => typeof window !== 'undefined' && 'speechSynthesis' in window

export const hablar = (texto) => {
  if (!vozDisponible()) return
  window.speechSynthesis.cancel()
  const frase = new SpeechSynthesisUtterance(texto)
  frase.lang = 'es-ES'
  frase.rate = 0.9
  frase.pitch = 1.2
  const voces = window.speechSynthesis.getVoices()
  frase.voice = voces.find((voz) => voz.lang.startsWith('es')) ?? null
  window.speechSynthesis.speak(frase)
}

export const callar = () => {
  if (vozDisponible()) window.speechSynthesis.cancel()
}