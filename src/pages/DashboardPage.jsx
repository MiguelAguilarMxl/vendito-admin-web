export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card title="Negocios registrados" value="0" />
        <Card title="Suscripciones activas" value="0" />
        <Card title="Ingresos mensuales" value="$0 MXN" />
        <Card title="Pruebas gratuitas" value="0" />
        <Card title="Tickets abiertos" value="0" />
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <div className="text-sm text-gray-500">
        {title}
      </div>

      <div className="mt-2 text-2xl font-bold">
        {value}
      </div>
    </div>
  )
}