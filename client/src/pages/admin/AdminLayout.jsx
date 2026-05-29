import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/products', label: 'Productos' },
  { to: '/admin/orders', label: 'Pedidos' },
  { to: '/admin/customers', label: 'Clientes' },
];

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-gray-800">
          <p className="font-serif font-bold text-lg">akireshopcr</p>
          <p className="text-xs text-gray-400 mt-0.5">Panel admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.exact}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded text-sm transition-colors ${isActive ? 'bg-brand-500 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-gray-800">
          <NavLink to="/" className="text-xs text-gray-400 hover:text-white transition-colors">← Ver tienda</NavLink>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
