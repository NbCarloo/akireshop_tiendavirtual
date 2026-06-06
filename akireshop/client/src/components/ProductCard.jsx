import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import api from '../api';
import { ShiftCard } from './ui/shift-card';

function formatPrice(amount) {
  return `₡${Math.round(amount).toLocaleString('en-US')}`;
}

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
    <Link to={`/product/${product.slug}`} className="block">
      <ShiftCard
        className="aspect-[3/4] rounded-xl bg-gray-100 cursor-pointer"
        collapsedHeight={64}
        expandedHeight={148}
        topContent={
          <div className="flex flex-col gap-1">
            {product.tags?.includes('new-arrival') && (
              <span className="badge bg-gray-900 text-white">New</span>
            )}
            {isOnSale && (
              <span className="badge bg-black text-white">Sale</span>
            )}
          </div>
        }
        topAnimateContent={
          <button
            onClick={handleWishlist}
            className="p-1.5 bg-white/90 hover:bg-white rounded-full transition-colors shadow-sm"
            aria-label="Agregar a wishlist"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        }
        bottomContent={(isHovered) => (
          <div className="px-3 pt-3 pb-3">
            <p className="text-sm font-medium text-gray-900 truncate leading-tight">{product.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-gray-900">{formatPrice(price)}</span>
              {isOnSale && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 6 }}
              transition={{ duration: 0.22, delay: isHovered ? 0.12 : 0, ease: [0.23, 1, 0.32, 1] }}
              className="mt-2.5 space-y-2"
            >
              {product.colors?.length > 0 && (
                <div className="flex items-center gap-1.5">
                  {product.colors.slice(0, 5).map(c => (
                    <span
                      key={c.name}
                      className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: c.hex || '#ccc' }}
                      title={c.name}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className="text-xs text-gray-400">+{product.colors.length - 5}</span>
                  )}
                </div>
              )}

              <button
                onClick={handleQuickAdd}
                className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.98] text-white text-xs font-medium tracking-wider uppercase py-2.5 rounded-lg transition-all"
              >
                Agregar al carrito
              </button>
            </motion.div>
          </div>
        )}
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
            Sin imagen
          </div>
        )}
      </ShiftCard>
    </Link>
  );
}
