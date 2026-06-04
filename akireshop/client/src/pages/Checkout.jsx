import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';
// Your store's SINPE Móvil number — update this
const SINPE_PHONE = '8888-8888';

function AddressForm({ address, onChange, guestEmail, onEmailChange, showEmail }) {
  return (
    <div className="space-y-3">
      {showEmail && (
        <input className="input" placeholder="Email (para confirmación)" type="email" required
          value={guestEmail} onChange={e => onEmailChange(e.target.value)} />
      )}
      <input className="input" placeholder="Nombre completo *" required
        value={address.name} onChange={e => onChange({ ...address, name: e.target.value })} />
      <input className="input" placeholder="Dirección *" required
        value={address.street} onChange={e => onChange({ ...address, street: e.target.value })} />
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Ciudad *" required
          value={address.city} onChange={e => onChange({ ...address, city: e.target.value })} />
        <input className="input" placeholder="Provincia"
          value={address.state} onChange={e => onChange({ ...address, state: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Código postal"
          value={address.zip} onChange={e => onChange({ ...address, zip: e.target.value })} />
        <input className="input" placeholder="País *" required
          value={address.country} onChange={e => onChange({ ...address, country: e.target.value })} />
      </div>
    </div>
  );
}

function OrderSummary({ items, subtotal, shippingCost, total }) {
  return (
    <div className="bg-gray-50 p-6 space-y-4">
      {items.map(item => (
        <div key={item.key} className="flex gap-4">
          {item.image && <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-gray-200 flex-shrink-0" />}
          <div className="flex-1 text-sm">
            <p className="font-medium">{item.name}</p>
            <p className="text-gray-500">{item.color} · {item.size} · ×{item.qty}</p>
            <p className="font-semibold mt-1">${(item.price * item.qty).toFixed(2)}</p>
          </div>
        </div>
      ))}
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Envío</span>
          <span>{shippingCost === 0 ? 'Gratis 🎉' : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t pt-2">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ name: '', street: '', city: '', state: '', zip: '', country: 'Costa Rica' });
  const [guestEmail, setGuestEmail] = useState('');
  const [payMethod, setPayMethod] = useState('paypal');
  const [sinpeRef, setSinpeRef] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [submittingSinpe, setSubmittingSinpe] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    if (!items.length) return;
    const sc = subtotal >= 75 ? 0 : 5.99;
    setShippingCost(sc);
    setTotal(subtotal + sc);
    setLoadingTotals(false);
  }, [items, subtotal]);

  useEffect(() => {
    const ok = address.name && address.street && address.city && address.country &&
      (user || guestEmail);
    setFormValid(Boolean(ok));
  }, [address, guestEmail, user]);

  const commonPayload = (extras = {}) => ({
    items: items.map(i => ({ productId: i.productId, color: i.color, size: i.size, qty: i.qty })),
    shippingAddress: address,
    subtotal,
    shippingCost,
    total,
    userId: user?._id || null,
    guestEmail: !user ? guestEmail : null,
    ...extras,
  });

  // PayPal: create order on server
  const createPayPalOrder = async () => {
    const { data } = await api.post('/orders/paypal/create-order', {
      items: items.map(i => ({ productId: i.productId, qty: i.qty })),
    });
    return data.id;
  };

  // PayPal: after approval, capture on server
  const onPayPalApprove = async (data) => {
    try {
      const { data: order } = await api.post('/orders/paypal/capture', commonPayload({ paypalOrderId: data.orderID }));
      clearCart();
      toast.success('¡Pago completado!');
      navigate(`/order-confirmation/${order._id}`);
    } catch {
      toast.error('Error al completar el pago. Contacta soporte.');
    }
  };

  // SINPE: manual submit
  const handleSinpe = async (e) => {
    e.preventDefault();
    if (!sinpeRef.trim()) return toast.error('Ingresa el número de comprobante SINPE');
    setSubmittingSinpe(true);
    try {
      const { data: order } = await api.post('/orders/sinpe', commonPayload({ sinpeReference: sinpeRef.trim() }));
      clearCart();
      toast.success('¡Pedido recibido! Lo confirmaremos en breve.');
      navigate(`/order-confirmation/${order._id}`);
    } catch {
      toast.error('Error al procesar el pedido.');
    } finally {
      setSubmittingSinpe(false);
    }
  };

  if (!items.length) return (
    <div className="text-center py-20 text-gray-500">Tu carrito está vacío.</div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-4xl font-bold mb-10">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: address + payment */}
        <div className="space-y-8">
          {/* Shipping address */}
          <section>
            <h2 className="font-semibold text-lg mb-4">Dirección de envío</h2>
            <AddressForm
              address={address}
              onChange={setAddress}
              guestEmail={guestEmail}
              onEmailChange={setGuestEmail}
              showEmail={!user}
            />
          </section>

          {/* Payment method tabs */}
          <section>
            <h2 className="font-semibold text-lg mb-4">Método de pago</h2>
            <div className="flex gap-0 border-b mb-6">
              {[
                { id: 'paypal', label: 'PayPal / Tarjeta' },
                { id: 'sinpe', label: 'SINPE Móvil' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${payMethod === m.id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* PayPal */}
            {payMethod === 'paypal' && (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Paga con tu cuenta PayPal o con tarjeta de crédito/débito de forma segura.
                </p>
                {!formValid ? (
                  <p className="text-sm text-orange-500 bg-orange-50 border border-orange-200 px-4 py-3">
                    Completa tu nombre, dirección y {!user ? 'email ' : ''}antes de pagar.
                  </p>
                ) : loadingTotals ? (
                  <p className="text-gray-400 text-sm">Calculando total...</p>
                ) : (
                  <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD' }}>
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'black', label: 'pay', height: 48 }}
                      createOrder={createPayPalOrder}
                      onApprove={onPayPalApprove}
                      onError={() => toast.error('Error con PayPal. Intenta de nuevo.')}
                    />
                  </PayPalScriptProvider>
                )}
              </div>
            )}

            {/* SINPE Móvil */}
            {payMethod === 'sinpe' && (
              <form onSubmit={handleSinpe} className="space-y-5">
                <div className="bg-brand-50 border border-brand-200 p-5 rounded">
                  <p className="font-semibold text-gray-900 mb-1">Instrucciones SINPE Móvil</p>
                  <ol className="text-sm text-gray-700 space-y-1.5 list-decimal list-inside">
                    <li>Abre tu app bancaria y selecciona <strong>SINPE Móvil</strong></li>
                    <li>Transfiere <strong>${total.toFixed(2)} USD</strong> (o el equivalente en colones) al número:</li>
                  </ol>
                  <div className="mt-3 bg-white border border-brand-300 px-5 py-3 text-center">
                    <p className="text-2xl font-bold tracking-widest text-brand-600">{SINPE_PHONE}</p>
                    <p className="text-xs text-gray-500 mt-0.5">akireshopcr</p>
                  </div>
                  <ol className="text-sm text-gray-700 space-y-1.5 list-decimal list-inside mt-3" start={3}>
                    <li>Copia el <strong>número de comprobante</strong> que recibes</li>
                    <li>Pégalo abajo y confirma tu pedido</li>
                  </ol>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Número de comprobante SINPE *</label>
                  <input
                    className="input"
                    placeholder="Ej: 202405271234567"
                    value={sinpeRef}
                    onChange={e => setSinpeRef(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Lo usamos para verificar tu transferencia.</p>
                </div>

                {!formValid && (
                  <p className="text-sm text-orange-500 bg-orange-50 border border-orange-200 px-4 py-3">
                    Completa la dirección de envío antes de confirmar.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submittingSinpe || !formValid}
                  className="btn-primary w-full py-4"
                >
                  {submittingSinpe ? 'Procesando...' : 'Confirmar pedido (SINPE)'}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Tu pedido quedará como <strong>pendiente</strong> hasta que confirmemos la transferencia (máx. 2 horas hábiles).
                </p>
              </form>
            )}
          </section>
        </div>

        {/* Right: order summary */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Resumen del pedido</h2>
          <OrderSummary items={items} subtotal={subtotal} shippingCost={shippingCost} total={total} />
        </div>
      </div>
    </div>
  );
}
