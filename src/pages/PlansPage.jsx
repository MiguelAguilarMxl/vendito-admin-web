import { useEffect, useState } from 'react'
import { getPlans } from '../api/planApi'

export default function PlansPage() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    try {
      const data = await getPlans()
      setPlans(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Cargando planes...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Planes
        </h1>

        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold">
          {plans.length} planes
        </span>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="py-3">Código</th>
              <th className="py-3">Nombre</th>
              <th className="py-3">Mensual</th>
              <th className="py-3">Anual</th>
              <th className="py-3">Productos</th>
              <th className="py-3">Usuarios</th>
              <th className="py-3">Estado</th>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr key={plan.code} className="border-b last:border-0">
                <td className="py-3 font-semibold">{plan.code}</td>
                <td className="py-3">{plan.name}</td>
                <td className="py-3">{formatMoney(plan.monthlyPrice)}</td>
                <td className="py-3">{formatMoney(plan.yearlyPrice)}</td>
                <td className="py-3">{formatLimit(plan.productLimit)}</td>
                <td className="py-3">{formatLimit(plan.userLimit)}</td>
                <td className="py-3">
                  <StatusBadge active={plan.active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ active }) {
  return (
    <span
      className={
        active
          ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700'
          : 'rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700'
      }
    >
      {active ? 'ACTIVO' : 'INACTIVO'}
    </span>
  )
}

function formatMoney(value) {
  if (value === null || value === undefined) {
    return '-'
  }

  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value)
}

function formatLimit(value) {
  if (value === null || value === undefined) {
    return 'Ilimitado'
  }

  return value
}