import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import api from '../api';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { addItem, setOpen } = useCart();
  const image = product.colors?.[0]?.images?.[0];
  const price = product.salePrice || product.price;
  const isOnSale = product.salePrice && product.salePrice < product.price;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const size = product.sizes?.find(s => s.stock > 0)?.size;
    if (!size) return toast.error('Sin stock disponible');
    addItem({
      productId: product._id,
      name: product.name,
      price,
      image,
      color: product.colors?.[0]?.name || '',
      size,
      qty: 1,
    });
    toast.success('Agregado al carrito');
    setOpen(true);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Inicia sesión para guardar en wishlist');
    try {
      await api.post(`/users/wishlist/${product._id}`);
      toast.success('Guardado en wishlist');
    } catch {
      toast.error('Error al guardar');
    }
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Sin imagen</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.tags?.includes('new-arrival') && (
            <span className="badge bg-brand-500 text-white">New</span>
          )}
          {isOnSale && (
            <span className="badge bg-black text-white">Sale</span>
          )}
          {product.tags?.includes('trending') && (
            <span className="badge bg-gray-900 text-white">Trending</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Agregar a wishlist"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Quick add */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-0 inset-x-0 bg-gray-900 text-white text-xs font-medium tracking-wider uppercase py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          Agregar al carrito
        </button>
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium truncate">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold">${price.toFixed(2)}</span>
          {isOnSale && (
            <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
          )}
        </div>
        {product.ratings?.count > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs text-gray-500">{product.ratings.average} ({product.ratings.count})</span>
          </div>
        )}
      </div>
    </Link>
  );
}
