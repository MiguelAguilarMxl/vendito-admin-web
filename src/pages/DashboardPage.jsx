import { useEffect, useState } from 'react'
import { getDashboard } from '../api/dashboardApi'

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const data = await getDashboard()
      setDashboard(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Cargando dashboard...</div>
  }

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card title="Negocios registrados" value={dashboard.businesses} />
        <Card title="Negocios activos" value={dashboard.activeBusinesses} />
        <Card title="Plan FREE" value={dashboard.freeBusinesses} />
        <Card title="Plan PRO" value={dashboard.proBusinesses} />
        <Card title="Plan BUSINESS" value={dashboard.businessPlanBusinesses} />
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  )
}