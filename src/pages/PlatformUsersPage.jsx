import { useEffect, useState } from 'react'
import { getPlatformUsers } from '../api/platformUserApi'

export default function PlatformUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [role, setRole] = useState('')
  const [active, setActive] = useState('')

  useEffect(() => {
    loadUsers()
  }, [role, active])

  async function loadUsers() {
    try {
      setLoading(true)

      const data = await getPlatformUsers({
        role,
        active: active === '' ? null : active === 'true',
      })

      setUsers(data)
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setRole('')
    setActive('')
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Usuarios Plataforma
        </h1>

        <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold">
          {users.length} usuarios
        </span>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Rol
            </label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Todos los roles</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="EXECUTIVE">EXECUTIVE</option>
              <option value="SUPPORT_MANAGER">SUPPORT_MANAGER</option>
              <option value="SUPPORT_AGENT">SUPPORT_AGENT</option>
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
        <div>Cargando usuarios...</div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow">
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

                  <td className="py-3">
                    {user.email}
                  </td>

                  <td className="py-3">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="py-3">
                    <span
                      className={
                        user.active
                          ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700'
                          : 'rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700'
                      }
                    >
                      {user.active ? 'ACTIVO' : 'INACTIVO'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay usuarios con esos filtros.
            </div>
          )}
        </div>
      )}
    </div>
  )
}