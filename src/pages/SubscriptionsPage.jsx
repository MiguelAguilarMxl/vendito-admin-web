import { useEffect, useState } from 'react'
import { getSubscriptions } from '../api/subscriptionApi'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    loadSubscriptions()
  }, [plan, status])

  async function loadSubscriptions() {
    try {
      setLoading(true)

      const data = await getSubscriptions({
        plan,
        status,
      })

      setSubscriptions(data)
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setPlan('')
    setStatus('')
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Suscripciones</h1>

        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold">
          {subscriptions.length} suscripciones
        </span>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="grid gap-4 md:grid-cols-3">
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
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Todos</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
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
        <div>Cargando suscripciones...</div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="py-3">Negocio</th>
                  <th className="py-3">Plan</th>
                  <th className="py-3">Estado</th>
                  <th className="py-3">Inicio</th>
                  <th className="py-3">Fin</th>
                </tr>
              </thead>

              <tbody>
                {subscriptions.map((subscription, index) => (
                  <tr
                    key={`${subscription.businessId}-${subscription.startDate}-${index}`}
                    className="border-b last:border-0"
                  >
                    <td className="py-3 font-semibold">
                      {subscription.businessName}
                    </td>

                    <td className="py-3">
                      <PlanBadge plan={subscription.plan} />
                    </td>

                    <td className="py-3">
                      <StatusBadge status={subscription.status} />
                    </td>

                    <td className="py-3">
                      {formatDate(subscription.startDate)}
                    </td>

                    <td className="py-3">
                      {formatDate(subscription.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {subscriptions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No hay suscripciones con esos filtros.
              </div>
            )}
          </div>
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
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[plan] || styles.FREE
      }`}
    >
      {plan || 'FREE'}
    </span>
  )
}

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: 'bg-green-100 text-green-700',
    INACTIVE: 'bg-gray-100 text-gray-700',
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || styles.INACTIVE
      }`}
    >
      {status}
    </span>
  )
}

function formatDate(value) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}