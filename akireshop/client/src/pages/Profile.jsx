import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

const STATUS_LABELS = {
  pending: 'Pendiente', paid: 'Pagado', processing: 'Procesando',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
};
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700', paid: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('orders');
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setEditForm({ name: user.name, email: user.email, password: '' });
    api.get('/orders/my-orders').then(r => setOrders(r.data));
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updates = { name: editForm.name, email: editForm.email };
      if (editForm.password) updates.password = editForm.password;
      await api.put('/users/me', updates);
      toast.success('Perfil actualizado');
    } catch {
      toast.error('Error al actualizar');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Mi cuenta</h1>
        <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-gray-500 hover:text-gray-900 underline">
          Cerrar sesión
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b mb-8">
        {['orders', 'settings'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            {t === 'orders' ? 'Mis pedidos' : 'Configuración'}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 && (
            <p className="text-gray-500 text-sm">Aún no tienes pedidos.</p>
          )}
          {orders.map(order => (
            <div key={order._id} className="border p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Pedido #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('es-CR')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                  <span className="font-bold text-sm">${order.total?.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-0.5">
                {order.items?.map((item, i) => (
                  <p key={i}>{item.name} — {item.color}, {item.size} ×{item.qty}</p>
                ))}
              </div>
              {order.trackingNumber && (
                <p className="text-xs text-brand-500 mt-2">Número de seguimiento: {order.trackingNumber}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <form onSubmit={handleUpdate} className="max-w-md space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Nombre</label>
            <input className="input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <input className="input" type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Nueva contraseña (opcional)</label>
            <input className="input" type="password" placeholder="Dejar en blanco para no cambiar" value={editForm.password}
              onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary py-3 px-8">Guardar cambios</button>
        </form>
      )}
    </div>
  );
}
