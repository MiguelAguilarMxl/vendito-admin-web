import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getBusinessById,
  getBusinessMetrics,
  getBusinessSubscription,
  getBusinessUsers,
} from '../api/businessApi'

export default function BusinessDetailPage() {
  const { id } = useParams()

  const [business, setBusiness] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusiness()
  }, [id])

  async function loadBusiness() {
    try {
      setLoading(true)

      const [
        businessData,
        subscriptionData,
        metricsData,
        usersData,
      ] = await Promise.all([
        getBusinessById(id),
        getBusinessSubscription(id),
        getBusinessMetrics(id),
        getBusinessUsers(id),
      ])

      setBusiness(businessData)
      setSubscription(subscriptionData)
      setMetrics(metricsData)
      setUsers(usersData)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Cargando negocio...</div>
  }

  if (!business) {
    return <div>Negocio no encontrado</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Detalle de Negocio
        </h1>

        <Link
          to="/businesses"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
        >
          Volver a Negocios
        </Link>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <div className="grid grid-cols-2 gap-6">
          <Field label="ID" value={business.id} />
          <Field label="Nombre" value={business.name} />
          <Field label="Tipo" value={business.businessType} />
          <Field label="Plan" value={business.plan} />
          <Field
            label="Estado"
            value={business.active ? 'ACTIVO' : 'INACTIVO'}
          />
          <Field
            label="Fecha Registro"
            value={formatDate(business.createdAt)}
          />
        </div>
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Suscripción
          </h2>

          {subscription && (
            <StatusBadge active={subscription.status === 'ACTIVE'} />
          )}
        </div>

        {subscription ? (
          <div className="grid grid-cols-2 gap-6">
            <Field label="Plan" value={subscription.plan} />
            <Field label="Estado" value={subscription.status} />
            <Field
              label="Inicio"
              value={formatDate(subscription.startDate)}
            />
            <Field
              label="Fin"
              value={formatDate(subscription.endDate)}
            />
          </div>
        ) : (
          <div className="text-gray-500">
            Este negocio no tiene suscripción activa.
          </div>
        )}
      </div>

      <div className="mb-8 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">
          Métricas
        </h2>

        {metrics ? (
          <div className="grid grid-cols-4 gap-4">
            <MetricCard label="Productos" value={metrics.products} />
            <MetricCard label="Usuarios" value={metrics.users} />
            <MetricCard label="Ventas" value={metrics.sales} />
            <MetricCard
              label="Estado"
              value={metrics.active ? 'ACTIVO' : 'INACTIVO'}
            />
          </div>
        ) : (
          <div className="text-gray-500">
            No hay métricas disponibles.
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Usuarios del Negocio
          </h2>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
            {users.length} usuarios
          </span>
        </div>

        {users.length === 0 ? (
          <div className="text-gray-500">
            Este negocio no tiene usuarios activos.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="py-3">ID</th>
                  <th className="py-3">Nombre</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Rol</th>
                  <th className="py-3">Estado</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3">{user.id}</td>
                    <td className="py-3 font-semibold">{user.name}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="py-3">
                      <StatusBadge active={user.active} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <div className="mb-1 text-sm text-gray-500">
        {label}
      </div>

      <div className="font-semibold">
        {value || '-'}
      </div>
    </div>
  )
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="mb-1 text-sm text-gray-500">
        {label}
      </div>

      <div className="text-2xl font-bold">
        {value}
      </div>
    </div>
  )
}

function RoleBadge({ role }) {
  return (
    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
      {role}
    </span>
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