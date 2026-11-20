import assert from 'node:assert/strict'
import { By, until } from 'selenium-webdriver'
import {
  clicEn,
  clicEtiqueta,
  crearNavegador,
  elegirOpcion,
  escribir,
  esperarRuta,
  esperarTexto,
  guardarCaptura,
  irA,
} from './helpers.js'

// Prueba de punta a punta (E2E) del recorrido completo de EcoPeques, HU-01 a HU-07.
// Necesita el backend (puerto 8080) y el front (npm run dev, puerto 5173) encendidos.
// Cada corrida crea un tutor nuevo con un correo único, así se puede repetir sin limpiar la base
describe('EcoPeques: flujo completo del tutor y el niño', function () {
  this.timeout(60000)

  let driver
  const tutor = {
    nombre: 'Prueba',
    apellido: 'Selenium',
    email: `tutor.e2e.${Date.now()}@ecopeques.test`,
    password: 'Prueba1234',
  }
  const nino = 'Lucía'
  let semillasMision = 0

  before(async () => {
    driver = await crearNavegador()
  })

  // Si una prueba falla, deja una captura de la pantalla en e2e/capturas.
  // Con CAPTURAS=1 guarda una captura de cada paso (sirve como evidencia para el informe)
  let paso = 0
  afterEach(async function () {
    paso += 1
    const fallo = this.currentTest.state === 'failed'
    if (fallo || process.env.CAPTURAS === '1') {
      const archivo = await guardarCaptura(driver, `${String(paso).padStart(2, '0')} ${this.currentTest.title}`)
      if (fallo) console.log(`      Captura del error: ${archivo}`)
    }
  })

  after(async () => {
    await driver?.quit()
  })

  it('HU-02: sin sesión, una ruta protegida lleva al login', async () => {
    await irA(driver, '/inicio')
    await esperarRuta(driver, '/login')
  })

  it('HU-01: registra un tutor nuevo y entra a "Mis niños"', async () => {
    await irA(driver, '/registro')
    await elegirOpcion(driver, 'Padre o madre')
    await escribir(driver, 'nombre', tutor.nombre)
    await escribir(driver, 'apellido', tutor.apellido)
    await escribir(driver, 'email', tutor.email)
    await escribir(driver, 'password', tutor.password)
    await escribir(driver, 'confirmPassword', tutor.password)
    await clicEn(driver, 'Crear cuenta')

    await esperarRuta(driver, '/inicio')
    await esperarTexto(driver, `¡Hola, ${tutor.nombre}!`)
    await esperarTexto(driver, 'Aún no tienes niños registrados')
  })

  it('HU-01: no deja registrar dos veces el mismo correo', async () => {
    await clicEtiqueta(driver, 'Cerrar sesión')
    await esperarRuta(driver, '/login')

    await irA(driver, '/registro')
    await escribir(driver, 'nombre', tutor.nombre)
    await escribir(driver, 'apellido', tutor.apellido)
    await escribir(driver, 'email', tutor.email)
    await escribir(driver, 'password', tutor.password)
    await escribir(driver, 'confirmPassword', tutor.password)
    await clicEn(driver, 'Crear cuenta')

    await esperarTexto(driver, 'El correo ya está registrado')
    assert.match(await driver.getCurrentUrl(), /\/registro/)
  })

  it('HU-02: rechaza una contraseña incorrecta', async () => {
    await irA(driver, '/login')
    await escribir(driver, 'email', tutor.email)
    await escribir(driver, 'password', 'OtraClave999')
    await clicEn(driver, 'Iniciar sesión')

    const alerta = await driver.wait(async () => {
      const alertas = await driver.findElements(By.css('[role="alert"]'))
      return alertas[0]
    }, 10000)
    assert.ok((await alerta.getText()).length > 0)
    assert.match(await driver.getCurrentUrl(), /\/login/)
  })

  it('HU-02: inicia sesión con los datos correctos', async () => {
    await escribir(driver, 'password', tutor.password)
    await clicEn(driver, 'Iniciar sesión')
    await esperarRuta(driver, '/inicio')
    await esperarTexto(driver, `¡Hola, ${tutor.nombre}!`)
  })

  it('HU-03: crea el perfil de un niño con avatar', async () => {
    await clicEn(driver, 'Agregar niño')
    await escribir(driver, 'nombre', nino)
    await elegirOpcion(driver, 'Mariposa')
    await escribir(driver, 'grupo', 'Transición A')
    await clicEn(driver, 'Guardar perfil')

    await esperarTexto(driver, `¡Listo! Creamos el perfil de ${nino}.`)
    await esperarTexto(driver, 'Transición A')
  })

  it('HU-04: filtra el catálogo de misiones por categoría', async () => {
    await clicEn(driver, 'Misiones')
    await esperarRuta(driver, '/misiones')
    await esperarTexto(driver, 'Asignar a niño')

    await clicEn(driver, 'Agua')
    await driver.wait(async () => {
      const pestana = await driver.findElement(By.xpath('//button[@role="tab"][contains(., "Agua")]'))
      return (await pestana.getAttribute('aria-selected')) === 'true'
    }, 10000)

    // Cada tarjeta muestra su categoría en una etiqueta: esperamos a que todas digan "Agua"
    const etiquetasXpath = '//li[.//button[contains(., "Asignar a niño")]]//span[contains(@class, "rounded-full")]'
    await driver.wait(async () => {
      try {
        const textos = await Promise.all((await driver.findElements(By.xpath(etiquetasXpath))).map((e) => e.getText()))
        return textos.length > 0 && textos.every((texto) => texto === 'Agua')
      } catch {
        return false // la lista se estaba redibujando; se vuelve a intentar
      }
    }, 10000, 'El catálogo no quedó filtrado solo con misiones de Agua')
  })

  it('HU-05: asigna una misión de Agua al niño', async () => {
    const primera = await driver.findElement(By.xpath('(//li[.//button[contains(., "Asignar a niño")]])[1]'))
    const recompensa = await primera.findElement(By.xpath('.//p[contains(., "semillas")]')).getText()
    semillasMision = Number(recompensa.match(/\d+/)[0])

    await primera.findElement(By.xpath('.//button[contains(., "Asignar a niño")]')).click()
    await elegirOpcion(driver, nino)
    await clicEn(driver, 'Asignar misión')
    await esperarTexto(driver, `a ${nino}.`)
    await esperarTexto(driver, '¡Listo! Asignamos')
  })

  it('HU-06: el tutor confirma que el niño cumplió la misión', async () => {
    await clicEn(driver, 'Pendientes')
    await esperarRuta(driver, '/pendientes')
    await clicEn(driver, 'Confirmar cumplimiento')
    await esperarTexto(driver, `cumplió esta misión`)
    await clicEn(driver, 'Sí, la cumplió')

    await esperarTexto(driver, `¡Bien hecho, ${nino}!`)
    await esperarTexto(driver, 'No hay misiones por confirmar')
  })

  it('HU-07: el niño riega su árbol y recibe sus semillas', async () => {
    await clicEn(driver, `Que ${nino} riegue su árbol`)
    await esperarRuta(driver, '/jugar/')
    await esperarTexto(driver, `¡Hola, ${nino}!`)
    await esperarTexto(driver, 'Brote')
    await esperarTexto(driver, '0 semillas')

    await clicEn(driver, 'Regar árbol')
    await esperarTexto(driver, `${semillasMision} semillas`)
    await esperarTexto(driver, 'Cumple tus misiones para regar tu árbol')
  })

  it('HU-07: las semillas no se suman dos veces (RN-02)', async () => {
    await driver.navigate().refresh()
    await esperarTexto(driver, `${semillasMision} semillas`)
    const botones = await driver.findElements(By.xpath('//button[contains(., "Regar árbol")]'))
    assert.equal(botones.length, 0, 'El botón "Regar árbol" no debería volver a aparecer')

    await clicEtiqueta(driver, 'Salir del modo niño')
    await esperarRuta(driver, '/inicio')
    const tarjeta = await driver.wait(until.elementLocated(By.xpath(`//li[contains(., "${nino}")]`)), 10000)
    assert.match(await tarjeta.getText(), new RegExp(`🌱 ${semillasMision}\\b`))
  })
})
