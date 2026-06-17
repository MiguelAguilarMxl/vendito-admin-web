import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white">
      <div className="p-5 text-xl font-bold">
        Vendito Admin
      </div>

      <nav className="mt-6">
        <NavLink
          to="/dashboard"
          className="block px-5 py-3 hover:bg-slate-800"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/businesses"
          className="block px-5 py-3 hover:bg-slate-800"
        >
          Negocios
        </NavLink>
      </nav>
    </aside>
  )
}