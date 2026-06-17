import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">
          Torre de control
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-semibold">
            {user?.name}
          </div>

          <div className="text-sm text-gray-500">
            {user?.role}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-md border px-3 py-2 text-sm hover:bg-slate-100"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}