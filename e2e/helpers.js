import fs from 'node:fs'
import path from 'node:path'
import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'

// Dirección del front. Con "npm run dev" es http://localhost:5173
export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:5173'
const ESPERA = 10000

// Abre Chrome. Selenium Manager descarga solo el chromedriver que corresponde a tu Chrome.
// Con HEADLESS=1 corre sin abrir la ventana (útil en CI)
export const crearNavegador = async () => {
  const opciones = new chrome.Options().addArguments('--window-size=430,932', '--lang=es')
  if (process.env.HEADLESS === '1') opciones.addArguments('--headless=new', '--no-sandbox')
  if (process.env.CHROME_BIN) opciones.setChromeBinaryPath(process.env.CHROME_BIN)

  const builder = new Builder().forBrowser('chrome').setChromeOptions(opciones)
  // Solo si quieres usar un chromedriver propio en vez del que descarga Selenium Manager
  if (process.env.CHROMEDRIVER_PATH) {
    const extras = (process.env.CHROMEDRIVER_ARGS ?? '').split(' ').filter(Boolean)
    builder.setChromeService(new chrome.ServiceBuilder(process.env.CHROMEDRIVER_PATH).addArguments(...extras))
  }
  return builder.build()
}

// Convierte un texto en literal de XPath ("..."), para buscar elementos por lo que dicen
const literal = (texto) => `"${texto.replaceAll('"', '')}"`

export const irA = (driver, ruta) => driver.get(`${BASE_URL}${ruta}`)

export const esperarRuta = (driver, ruta) => driver.wait(until.urlContains(ruta), ESPERA, `No se llegó a ${ruta}`)

// Espera a que el texto aparezca en cualquier parte de la página
export const esperarTexto = (driver, texto) =>
  driver.wait(
    async () => (await driver.findElement(By.css('body')).getText()).includes(texto),
    ESPERA,
    `No apareció el texto: ${texto}`,
  )

// Busca un botón o enlace visible por su texto y le hace clic
export const clicEn = async (driver, texto) => {
  const xpath = `//*[self::button or self::a][contains(normalize-space(.), ${literal(texto)})]`
  const elemento = await driver.wait(until.elementLocated(By.xpath(xpath)), ESPERA, `No está el botón: ${texto}`)
  await driver.wait(until.elementIsVisible(elemento), ESPERA)
  await driver.wait(until.elementIsEnabled(elemento), ESPERA)
  await driver.executeScript('arguments[0].scrollIntoView({block: "center"})', elemento)
  await elemento.click()
}

// Clic en el botón que se identifica por aria-label (por ejemplo, "Cerrar sesión")
export const clicEtiqueta = async (driver, etiqueta) => {
  const elemento = await driver.wait(until.elementLocated(By.css(`[aria-label=${literal(etiqueta)}]`)), ESPERA)
  await elemento.click()
}

// Las opciones de radio (rol, avatar, niño) están dentro de un <label>: se elige tocando el label
export const elegirOpcion = async (driver, texto) => {
  const xpath = `//label[contains(normalize-space(.), ${literal(texto)})]`
  const label = await driver.wait(until.elementLocated(By.xpath(xpath)), ESPERA, `No está la opción: ${texto}`)
  await label.click()
}

// Escribe en el campo con ese "name"
export const escribir = async (driver, name, valor) => {
  const campo = await driver.wait(until.elementLocated(By.name(name)), ESPERA, `No está el campo: ${name}`)
  await campo.clear()
  await campo.sendKeys(valor)
}

// Guarda una captura de pantalla en e2e/capturas (se usa cuando una prueba falla)
export const guardarCaptura = async (driver, nombre) => {
  const carpeta = path.resolve('e2e/capturas')
  fs.mkdirSync(carpeta, { recursive: true })
  const limpio = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w-]+/g, '_')
  const archivo = path.join(carpeta, `${limpio}.png`)
  fs.writeFileSync(archivo, await driver.takeScreenshot(), 'base64')
  return archivo
}
