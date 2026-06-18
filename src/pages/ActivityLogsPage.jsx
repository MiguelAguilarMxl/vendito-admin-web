import { useEffect, useState } from 'react'
import { getActivityLogs } from '../api/activityLogApi'

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const [action, setAction] = useState('')
  const [entity, setEntity] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadLogs()
  }, [action, entity, search])

  async function loadLogs() {
    try {
      setLoading(true)

      const data = await getActivityLogs({
        action,
        entity: entity.trim(),
        search: search.trim(),
      })

      setLogs(data)
    } catch (error) {
      console.error('Error loading activity logs', error)
    } finally {
      setLoading(false)
    }
  }

  function clearFilters() {
    setAction('')
    setEntity('')
    setSearch('')
  }

  function getBadgeClass(action) {
    switch (action) {
      case 'LOGIN':
        return 'bg-green-100 text-green-800'

      case 'CREATE':
        return 'bg-blue-100 text-blue-800'

      case 'UPDATE':
        return 'bg-yellow-100 text-yellow-800'

      case 'DELETE':
        return 'bg-red-100 text-red-800'

      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Activity Logs
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Auditoría y trazabilidad de acciones realizadas en la plataforma.
        </p>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Usuario o detalle"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Acción
            </label>
            <select
              value={action}
              onChange={(event) => setAction(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Todas las acciones</option>
              <option value="LOGIN">LOGIN</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">
              Entidad
            </label>
            <input
              type="text"
              placeholder="PlatformUser, Business..."
              value={entity}
              onChange={(event) => setEntity(event.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-slate-500"
            />
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

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-center text-slate-500">
            Cargando...
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Fecha
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Usuario
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Acción
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Entidad
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600">
                  Detalle
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-slate-200"
                >
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">
                    {log.user}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${getBadgeClass(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">
                    {log.entity}
                  </td>

                  <td className="px-4 py-3 text-sm text-slate-700">
                    {log.details}
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-6 text-center text-slate-500"
                  >
                    No existen registros con esos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}