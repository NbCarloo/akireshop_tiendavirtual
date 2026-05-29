import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setData(r.data));
  }, []);

  if (!data) return <div className="p-8 text-gray-400">Cargando...</div>;

  const stats = [
    { label: 'Ingresos totales', value: `$${data.totalRevenue.toFixed(2)}`, color: 'text-green-600' },
    { label: 'Pedidos totales', value: data.totalOrders, color: 'text-blue-600' },
    { label: 'Pedidos hoy', value: data.todayOrders, color: 'text-brand-500' },
    { label: 'Clientes', value: data.totalCustomers, color: 'text-purple-600' },
  ];

  const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-white border p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Últimos pedidos</h2>
            <Link to="/admin/orders" className="text-xs text-brand-500 hover:underline">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {data.recentOrders.map(order => (
              <div key={order._id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{order.user?.name || 'Invitado'}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('es-CR')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs px-2 py-0.5 ${STATUS_COLORS[order.status]}`}>{order.status}</span>
                  <span className="font-semibold">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Stock bajo</h2>
            <Link to="/admin/products" className="text-xs text-brand-500 hover:underline">Ver productos</Link>
          </div>
          {data.lowStock.length === 0 ? (
            <p className="text-sm text-gray-400">No hay productos con stock bajo.</p>
          ) : (
            <div className="space-y-3">
              {data.lowStock.map(p => (
                <div key={p._id} className="text-sm">
                  <p className="font-medium">{p.name}</p>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {p.sizes.filter(s => s.stock < 5).map(s => (
                      <span key={s.size} className="badge bg-orange-100 text-orange-700 px-2 py-0.5 text-xs">
                        {s.size}: {s.stock}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
