import { useEffect, useState } from 'react'
import { getBusinesses } from '../api/businessApi'

export default function BusinessesPage() {
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
      <h1 className="mb-6 text-3xl font-bold">
        Negocios
      </h1>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Plan</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Registro</th>
            </tr>
          </thead>

          <tbody>
            {businesses.map((business) => (
              <tr key={business.id} className="border-b">
                <td className="p-3">{business.id}</td>
                <td className="p-3">{business.name}</td>
                <td className="p-3">{business.businessType}</td>
                <td className="p-3">{business.plan}</td>
                <td className="p-3">
                  {business.active ? 'ACTIVO' : 'INACTIVO'}
                </td>
                <td className="p-3">
                  {business.createdAt?.substring(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}