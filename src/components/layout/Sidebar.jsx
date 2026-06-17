import { NavLink } from 'react-router-dom'

function navClass({ isActive }) {
  return [
    'block px-5 py-3 text-sm transition',
    isActive
      ? 'bg-slate-800 text-white'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
  ].join(' ')
}

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white">
      <div className="border-b border-slate-800 p-5">
        <div className="text-xl font-bold">
          Vendito Admin
        </div>

        <div className="mt-1 text-xs text-slate-400">
          Plataforma SaaS
        </div>
      </div>

      <nav className="mt-4">
        <NavLink to="/dashboard" className={navClass}>
          Dashboard
        </NavLink>

        <NavLink to="/businesses" className={navClass}>
          Negocios
        </NavLink>
      </nav>
    </aside>
  )
}