import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBusinesses } from '../api/businessApi'

export default function BusinessesPage() {
  const navigate = useNavigate()

  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [plan, setPlan] = useState('')
  const [active, setActive] = useState('')

  useEffect(() => {
    loadBusinesses()
  }, [search, plan, active])

  async function loadBusinesses() {
    try {
      setLoading(true)

      const data = await getBusinesses({
        search: search.trim(),
        plan,
        active: active === '' ? null : active === 'true',
      })

      setBusinesses(data)
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setSearch('')
    setPlan('')
    setActive('')
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Negocios</h1>
          <p className="mt-1 text-sm text-gray-500">
            {businesses.length} negocios encontrados
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Buscar
            </label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre del negocio"
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Plan
            </label>
            <select
              value={plan}
              onChange={(event) => setPlan(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Todos los planes</option>
              <option value="FREE">FREE</option>
              <option value="PRO">PRO</option>
              <option value="BUSINESS">BUSINESS</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Estado
            </label>
            <select
              value={active}
              onChange={(event) => setActive(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full rounded-md border px-3 py-2 text-sm hover:bg-slate-100"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div>Cargando negocios...</div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50 text-sm text-gray-600">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Plan</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Registro</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {businesses.map((business) => (
                <tr
                  key={business.id}
                  className="border-b text-sm hover:bg-slate-50"
                >
                  <td className="p-3 font-medium">{business.id}</td>
                  <td className="p-3">{business.name}</td>
                  <td className="p-3">{business.businessType || 'Sin tipo'}</td>
                  <td className="p-3">
                    <PlanBadge plan={business.plan} />
                  </td>
                  <td className="p-3">
                    <StatusBadge active={business.active} />
                  </td>
                  <td className="p-3">{formatDate(business.createdAt)}</td>
                  <td className="p-3">
                    <button
                      onClick={() => navigate(`/businesses/${business.id}`)}
                      className="rounded-md border px-3 py-1 text-xs hover:bg-slate-100"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {businesses.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay negocios con esos filtros.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function PlanBadge({ plan }) {
  const styles = {
    FREE: 'bg-gray-100 text-gray-700',
    PRO: 'bg-blue-100 text-blue-700',
    BUSINESS: 'bg-purple-100 text-purple-700',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[plan] || styles.FREE
      }`}
    >
      {plan || 'FREE'}
    </span>
  )
}

function StatusBadge({ active }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      {active ? 'ACTIVO' : 'INACTIVO'}
    </span>
  )
}

function formatDate(value) {
  if (!value) {
    return '-'
  }

  return value.substring(0, 10)
}