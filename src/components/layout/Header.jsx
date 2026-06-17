import { useAuth } from '../../auth/AuthContext'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="flex h-16 items-center justify-end border-b bg-white px-6">
      <div className="text-right">
        <div className="font-semibold">
          {user?.name}
        </div>

        <div className="text-sm text-gray-500">
          {user?.role}
        </div>
      </div>
    </header>
  )
}