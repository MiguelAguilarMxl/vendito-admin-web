import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBusiness, getBusinesses } from '../api/businessApi'
import { getBusinessTypes } from '../api/businessTypeApi'

export default function BusinessesPage() {
  const navigate = useNavigate()

  const [businesses, setBusinesses] = useState([])
  const [businessTypes, setBusinessTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [search, setSearch] = useState('')
  const [plan, setPlan] = useState('')
  const [active, setActive] = useState('')

  const [form, setForm] = useState({
    name: '',
    businessTypeId: '',
    plan: 'FREE',
    active: true,
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    loadBusinesses()
  }, [search, plan, active])

  async function loadInitialData() {
    try {
      const types = await getBusinessTypes()
      setBusinessTypes(types)
    } finally {
      loadBusinesses()
    }
  }

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

  function resetForm() {
    setForm({
      name: '',
      businessTypeId: '',
      plan: 'FREE',
      active: true,
    })
  }

  async function handleCreateBusiness(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      alert('El nombre del negocio es obligatorio')
      return
    }

    if (!form.businessTypeId) {
      alert('Selecciona un tipo de negocio')
      return
    }

    try {
      setSaving(true)

      await createBusiness({
        name: form.name.trim(),
        businessTypeId: Number(form.businessTypeId),
        plan: form.plan,
        active: form.active,
      })

      resetForm()
      setShowForm(false)
      await loadBusinesses()
    } finally {
      setSaving(false)
    }
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

        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Nuevo Negocio
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Crear nuevo negocio</h2>

            <button
              onClick={() => {
                resetForm()
                setShowForm(false)
              }}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              Cerrar
            </button>
          </div>

          <form onSubmit={handleCreateBusiness}>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Nombre del negocio"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Tipo
                </label>
                <select
                  value={form.businessTypeId}
                  onChange={(event) =>
                    setForm({ ...form, businessTypeId: event.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option value="">Selecciona tipo</option>
                  {businessTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">
                  Plan
                </label>
                <select
                  value={form.plan}
                  onChange={(event) =>
                    setForm({ ...form, plan: event.target.value })
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
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
                  value={form.active ? 'true' : 'false'}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      active: event.target.value === 'true',
                    })
                  }
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
                className="rounded-md border px-4 py-2 text-sm hover:bg-slate-100"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : 'Crear negocio'}
              </button>
            </div>
          </form>
        </div>
      )}

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