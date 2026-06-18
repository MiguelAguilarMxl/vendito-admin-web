import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  createBusinessUser,
  getBusinessById,
  getBusinessMetrics,
  getBusinessSubscription,
  getBusinessUsers,
  upsertBusinessSubscription,
} from '../api/businessApi'

export default function BusinessDetailPage() {
  const { id } = useParams()

  const [business, setBusiness] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [showSubscriptionForm, setShowSubscriptionForm] =
    useState(false)
  const [subscriptionForm, setSubscriptionForm] = useState({
    plan: 'PRO',
    status: 'ACTIVE',
  })
  const [savingSubscription, setSavingSubscription] =
    useState(false)

  const [showUserForm, setShowUserForm] = useState(false)
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: 'Temporal123',
    role: 'ADMIN',
    active: true,
  })
  const [savingUser, setSavingUser] = useState(false)

  useEffect(() => {
    loadBusiness()
  }, [id])

  async function loadBusiness() {
    try {
      setLoading(true)

      const businessData = await getBusinessById(id)

      setBusiness(businessData)

      const [subscriptionResult, metricsResult, usersResult] =
        await Promise.allSettled([
          getBusinessSubscription(id),
          getBusinessMetrics(id),
          getBusinessUsers(id),
        ])

      if (subscriptionResult.status === 'fulfilled') {
        setSubscription(subscriptionResult.value)
        setSubscriptionForm({
          plan: subscriptionResult.value.plan || businessData.plan || 'PRO',
          status: subscriptionResult.value.status || 'ACTIVE',
        })
      } else {
        setSubscription(null)
        setSubscriptionForm({
          plan: businessData.plan || 'PRO',
          status: 'ACTIVE',
        })
      }

      if (metricsResult.status === 'fulfilled') {
        setMetrics(metricsResult.value)
      } else {
        setMetrics({
          products: 0,
          users: 0,
          sales: 0,
          active: businessData.active,
        })
      }

      if (usersResult.status === 'fulfilled') {
        setUsers(usersResult.value)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error(error)
      setBusiness(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubscriptionSubmit(event) {
    event.preventDefault()

    try {
      setSavingSubscription(true)

      await upsertBusinessSubscription(id, subscriptionForm)

      setShowSubscriptionForm(false)
      await loadBusiness()
    } catch (error) {
      console.error(error)
      alert('No se pudo guardar la suscripción')
    } finally {
      setSavingSubscription(false)
    }
  }

  function handleSubscriptionChange(event) {
    const { name, value } = event.target

    setSubscriptionForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleUserSubmit(event) {
    event.preventDefault()

    try {
      setSavingUser(true)

      await createBusinessUser(id, userForm)

      setShowUserForm(false)
      setUserForm({
        name: '',
        email: '',
        password: 'Temporal123',
        role: 'ADMIN',
        active: true,
      })

      await loadBusiness()
    } catch (error) {
      console.error(error)
      alert('No se pudo crear el usuario')
    } finally {
      setSavingUser(false)
    }
  }

  function handleUserChange(event) {
    const { name, value, type, checked } = event.target

    setUserForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
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
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">
              Suscripción
            </h2>

            {subscription && (
              <StatusBadge
                active={subscription.status === 'ACTIVE'}
              />
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setShowSubscriptionForm((current) => !current)
            }
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            {subscription
              ? 'Editar Suscripción'
              : 'Asignar Suscripción'}
          </button>
        </div>

        {showSubscriptionForm && (
          <form
            onSubmit={handleSubscriptionSubmit}
            className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Plan
                </label>

                <select
                  name="plan"
                  value={subscriptionForm.plan}
                  onChange={handleSubscriptionChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="FREE">FREE</option>
                  <option value="PRO">PRO</option>
                  <option value="BUSINESS">BUSINESS</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={subscriptionForm.status}
                  onChange={handleSubscriptionChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={savingSubscription}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {savingSubscription
                  ? 'Guardando...'
                  : 'Guardar Suscripción'}
              </button>

              <button
                type="button"
                onClick={() => setShowSubscriptionForm(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

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
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">
              Usuarios del Negocio
            </h2>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
              {users.length} usuarios
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowUserForm((current) => !current)}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Nuevo Usuario
          </button>
        </div>

        {showUserForm && (
          <form
            onSubmit={handleUserSubmit}
            className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Nombre
                </label>

                <input
                  name="name"
                  value={userForm.name}
                  onChange={handleUserChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Administrador Demo"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={userForm.email}
                  onChange={handleUserChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="admin@negocio.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Password Temporal
                </label>

                <input
                  name="password"
                  type="text"
                  value={userForm.password}
                  onChange={handleUserChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Rol
                </label>

                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleUserChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="CASHIER">CASHIER</option>
                </select>
              </div>
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <input
                name="active"
                type="checkbox"
                checked={userForm.active}
                onChange={handleUserChange}
              />
              Usuario activo
            </label>

            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={savingUser}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {savingUser ? 'Guardando...' : 'Guardar Usuario'}
              </button>

              <button
                type="button"
                onClick={() => setShowUserForm(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

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
                  <tr
                    key={user.id}
                    className="border-b last:border-0"
                  >
                    <td className="py-3">{user.id}</td>
                    <td className="py-3 font-semibold">
                      {user.name}
                    </td>
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