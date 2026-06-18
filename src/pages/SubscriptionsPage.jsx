import { useEffect, useState } from 'react'
import { getSubscriptions } from '../api/subscriptionApi'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  async function loadSubscriptions() {
    try {
      const data = await getSubscriptions()
      setSubscriptions(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Cargando suscripciones...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Suscripciones
        </h1>

        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold">
          {subscriptions.length} suscripciones
        </span>
      </div>

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
        </div>
      </div>
    </div>
  )
}

function PlanBadge({ plan }) {
  return (
    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
      {plan}
    </span>
  )
}

function StatusBadge({ status }) {
  const isActive = status === 'ACTIVE'

  return (
    <span
      className={
        isActive
          ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700'
          : 'rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700'
      }
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