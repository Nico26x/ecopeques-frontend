// Reduce una foto del celular para enviarla como evidencia (máximo 1280 px por lado, en JPEG).
// Devuelve un texto "data:image/jpeg;base64,..." que el backend acepta hasta 2 MB
export const comprimirImagen = (archivo, ladoMaximo = 1280, calidad = 0.7) =>
  new Promise((resolve, reject) => {
    if (!archivo.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen'))
      return
    }

    const url = URL.createObjectURL(archivo)
    const img = new Image()
    img.onload = () => {
      const escala = Math.min(1, ladoMaximo / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * escala)
      canvas.height = Math.round(img.height * escala)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', calidad))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })