import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(r => setOrder(r.data)).catch(() => {});
  }, [id]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-serif text-3xl font-bold mb-3">¡Pedido confirmado!</h1>
      <p className="text-gray-600 mb-2">Gracias por tu compra. Te enviamos un correo de confirmación.</p>
      {order && (
        <p className="text-sm text-gray-400 mb-8">Pedido #{order._id}</p>
      )}

      {order && (
        <div className="bg-gray-50 text-left p-6 mb-8 space-y-3">
          <h2 className="font-semibold mb-4">Detalle del pedido</h2>
          {order.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.name} — {item.color}, {item.size} ×{item.qty}</span>
              <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>${order.total?.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 text-sm text-gray-600">
            <p>Enviar a: {order.shippingAddress?.name}</p>
            <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Link to="/" className="btn-outline py-3 px-6">Volver al inicio</Link>
        <Link to="/collection" className="btn-primary py-3 px-6">Seguir comprando</Link>
      </div>
    </div>
  );
}
