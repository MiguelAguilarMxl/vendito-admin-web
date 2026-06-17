import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getBusinessById } from '../api/businessApi'

export default function BusinessDetailPage() {
  const { id } = useParams()

  const [business, setBusiness] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBusiness()
  }, [id])

  async function loadBusiness() {
    try {
      const data = await getBusinessById(id)
      setBusiness(data)
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
      <h1 className="mb-6 text-3xl font-bold">
        Detalle de Negocio
      </h1>

      <div className="rounded-lg bg-white p-6 shadow">
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
            value={business.createdAt}
          />
        </div>
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
        {value}
      </div>
    </div>
  )
}