import logo from '../../assets/logo-ecopeques.png'

// Marco común de las pantallas de Login y Registro: encabezado verde con el logo y una tarjeta blanca
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="flex min-h-svh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl">
        <header className="bg-gradient-to-br from-eco-500 to-eco-700 px-6 pb-8 pt-6 text-center text-white">
          <img
            src={logo}
            alt="Logo de EcoPeques"
            className="mx-auto size-24 rounded-full bg-white p-1 shadow-lg"
          />
          <h1 className="mt-3 text-2xl font-extrabold">{title}</h1>
          {subtitle && <p className="mt-1 text-eco-100">{subtitle}</p>}
        </header>
        <div className="px-6 py-6">{children}</div>
      </div>
    </main>
  )
}