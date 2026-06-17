import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBusinesses } from '../api/businessApi'

export default function BusinessesPage() {
  const navigate = useNavigate()

  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusinesses()
  }, [])

  async function loadBusinesses() {
    try {
      const data = await getBusinesses()
      setBusinesses(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Cargando negocios...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Negocios</h1>
          <p className="mt-1 text-sm text-gray-500">
            {businesses.length} negocios registrados
          </p>
        </div>
      </div>

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
                <td className="p-3">
                  {formatDate(business.createdAt)}
                </td>
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
            No hay negocios registrados.
          </div>
        )}
      </div>
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
        active
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
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