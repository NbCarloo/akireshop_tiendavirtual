import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { user } = useAuth();
  const { addItem, setOpen } = useCart();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    api.get('/users/wishlist').then(r => setItems(r.data));
  }, [user]);

  const remove = async (productId) => {
    await api.post(`/users/wishlist/${productId}`);
    setItems(prev => prev.filter(p => p._id !== productId));
    toast.success('Eliminado de wishlist');
  };

  const moveToCart = (product) => {
    const size = product.sizes?.find(s => s.stock > 0)?.size;
    if (!size) return toast.error('Sin stock disponible');
    addItem({
      productId: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.colors?.[0]?.images?.[0] || '',
      color: product.colors?.[0]?.name || '',
      size,
      qty: 1,
    });
    remove(product._id);
    setOpen(true);
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-serif text-3xl font-bold mb-8">Mi Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-4">Tu wishlist está vacía.</p>
          <Link to="/collection" className="btn-primary py-3 px-8">Explorar Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(product => {
            const price = product.salePrice || product.price;
            const image = product.colors?.[0]?.images?.[0];
            return (
              <div key={product._id} className="group">
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  {image ? (
                    <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Sin imagen</div>
                  )}
                  <button
                    onClick={() => remove(product._id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full"
                    aria-label="Eliminar de wishlist"
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3">
                  <Link to={`/product/${product.slug}`} className="text-sm font-medium hover:text-brand-500 block truncate">{product.name}</Link>
                  <p className="text-sm font-semibold mt-1">${price.toFixed(2)}</p>
                  <button onClick={() => moveToCart(product)} className="mt-2 text-xs underline text-gray-500 hover:text-gray-900">
                    Mover al carrito
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
