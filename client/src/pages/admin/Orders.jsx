import { useEffect, useState } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

const STATUSES = ['', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);

  const fetch = async () => {
    const params = { page, limit: 25, ...(statusFilter && { status: statusFilter }) };
    const { data } = await api.get('/admin/orders', { params });
    setOrders(data.orders);
    setTotal(data.total);
  };

  useEffect(() => { fetch(); }, [page, statusFilter]);

  const updateOrder = async (id, updates) => {
    try {
      const { data } = await api.put(`/admin/orders/${id}`, updates);
      setOrders(prev => prev.map(o => o._id === id ? data : o));
      toast.success('Pedido actualizado');
    } catch {
      toast.error('Error al actualizar');
    }
  };

  return (
    <div className="p-8">
      <h1 className="font-serif text-3xl font-bold mb-6">Pedidos</h1>

      {/* Filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 text-sm border transition-colors ${statusFilter === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:border-gray-900'}`}
          >
            {s || 'Todos'}
          </button>
        ))}
      </div>

      <div className="bg-white border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Pedido</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Cliente</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Fecha</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(order => (
              <>
                <tr key={order._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3">{order.user?.name || order.guestEmail || 'Invitado'}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(order.createdAt).toLocaleDateString('es-CR')}</td>
                  <td className="px-4 py-3 font-semibold">${order.total?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => { e.stopPropagation(); updateOrder(order._id, { status: e.target.value }); }}
                      onClick={e => e.stopPropagation()}
                      className={`text-xs px-2 py-1 rounded font-medium border-0 ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gray-400 text-xs">{expanded === order._id ? '▲' : '▼'}</span>
                  </td>
                </tr>
                {expanded === order._id && (
                  <tr key={`${order._id}-detail`}>
                    <td colSpan={6} className="px-4 py-4 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Artículos</p>
                          {order.items?.map((item, i) => (
                            <p key={i} className="text-sm">{item.name} — {item.color}, {item.size} ×{item.qty} · ${(item.price * item.qty).toFixed(2)}</p>
                          ))}
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Envío</p>
                          <p className="text-sm">{order.shippingAddress?.name}</p>
                          <p className="text-sm text-gray-600">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                          <div className="mt-3 flex gap-2 items-center">
                            <input
                              className="input text-sm py-1.5 w-48"
                              placeholder="Número de seguimiento"
                              defaultValue={order.trackingNumber || ''}
                              onBlur={e => { if (e.target.value !== order.trackingNumber) updateOrder(order._id, { trackingNumber: e.target.value }); }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {total > 25 && (
        <div className="flex gap-2 mt-6">
          {Array.from({ length: Math.ceil(total / 25) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 text-sm border transition-colors ${page === p ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:border-gray-900'}`}
            >{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
