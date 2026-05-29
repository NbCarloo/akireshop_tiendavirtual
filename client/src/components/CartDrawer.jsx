import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, removeItem, updateQty, subtotal, open, setOpen } = useCart();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <h2 className="font-serif text-xl font-bold">Tu carrito</h2>
          <button onClick={() => setOpen(false)} className="p-1 hover:text-brand-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
            <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            <p className="text-gray-500">Tu carrito está vacío</p>
            <button onClick={() => setOpen(false)} className="btn-primary">Ver collection</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map(item => (
                <div key={item.key} className="flex gap-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-gray-100 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.color} · {item.size}</p>
                    <p className="text-sm font-semibold mt-1">${(item.price * item.qty).toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-gray-200">
                        <button
                          onClick={() => item.qty > 1 ? updateQty(item.key, item.qty - 1) : removeItem(item.key)}
                          className="px-2 py-1 text-sm hover:bg-gray-50"
                        >−</button>
                        <span className="px-3 text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.key, item.qty + 1)} className="px-2 py-1 text-sm hover:bg-gray-50">+</button>
                      </div>
                      <button onClick={() => removeItem(item.key)} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t px-6 py-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400">Envío gratis en pedidos mayores a $75</p>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className="btn-primary w-full text-center block py-4"
              >
                Ir a pagar
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
