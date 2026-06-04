import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductGallery from '../components/ProductGallery';
import ReviewStars from '../components/ReviewStars';
import SizeGuideModal from '../components/SizeGuideModal';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem, setOpen } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeGuide, setSizeGuide] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, body: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${slug}`).then(r => {
      setProduct(r.data);
      setSelectedColor(r.data.colors?.[0]?.name || '');
    });
  }, [slug]);

  useEffect(() => {
    if (product) {
      api.get(`/reviews/${product._id}`).then(r => setReviews(r.data));
    }
  }, [product?._id]);

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
      <div className="animate-pulse w-full max-w-4xl grid md:grid-cols-2 gap-10">
        <div className="aspect-[3/4] bg-gray-200" />
        <div className="space-y-4 pt-4">
          <div className="h-6 bg-gray-200 w-2/3" />
          <div className="h-4 bg-gray-200 w-1/4" />
          <div className="h-24 bg-gray-200 mt-4" />
        </div>
      </div>
    </div>
  );

  const price = product.salePrice || product.price;
  const isOnSale = product.salePrice && product.salePrice < product.price;
  const stockForSize = product.sizes?.find(s => s.size === selectedSize)?.stock ?? 0;

  const handleAddToCart = () => {
    if (!selectedSize) return toast.error('Elige una talla');
    if (stockForSize < 1) return toast.error('Sin stock en esta talla');
    const image = product.colors?.find(c => c.name === selectedColor)?.images?.[0] || '';
    addItem({ productId: product._id, name: product.name, price, image, color: selectedColor, size: selectedSize, qty });
    toast.success('Agregado al carrito ✓');
    setOpen(true);
  };

  const handleWishlist = async () => {
    if (!user) return toast.error('Inicia sesión para usar wishlist');
    await api.post(`/users/wishlist/${product._id}`);
    toast.success('Guardado en wishlist');
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Inicia sesión para dejar una reseña');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/reviews/${product._id}`, reviewForm);
      setReviews(prev => [data, ...prev]);
      setReviewForm({ rating: 5, body: '' });
      toast.success('Reseña enviada');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar reseña');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-8 flex gap-2">
        <Link to="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <Link to="/collection" className="hover:text-gray-700">Collection</Link>
        <span>/</span>
        <span className="text-gray-700">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <ProductGallery colors={product.colors} selectedColor={selectedColor} onColorChange={setSelectedColor} />

        {/* Info */}
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-500 mb-2">{product.category}</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">{product.name}</h1>

          {product.ratings?.count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <ReviewStars rating={product.ratings.average} />
              <span className="text-sm text-gray-500">({product.ratings.count} reseñas)</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold">${price.toFixed(2)}</span>
            {isOnSale && <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Color selector */}
          {product.colors?.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Color: <span className="font-normal text-gray-600">{selectedColor}</span></p>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c.name ? 'border-gray-900 scale-110' : 'border-gray-200'}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Talla</p>
              <button onClick={() => setSizeGuide(true)} className="text-xs underline text-gray-500 hover:text-gray-900">
                Guía de tallas
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map(s => (
                <button
                  key={s.size}
                  onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                  disabled={s.stock === 0}
                  className={`w-14 h-12 border text-sm font-medium transition-colors
                    ${selectedSize === s.size ? 'bg-gray-900 text-white border-gray-900' : ''}
                    ${s.stock === 0 ? 'opacity-30 cursor-not-allowed line-through' : 'border-gray-300 hover:border-gray-900'}
                  `}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {selectedSize && stockForSize <= 3 && stockForSize > 0 && (
              <p className="text-xs text-orange-500 mt-2">¡Solo quedan {stockForSize}!</p>
            )}
          </div>

          {/* Qty + Add */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-300">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-gray-50 text-lg">−</button>
              <span className="px-5 text-sm">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 hover:bg-gray-50 text-lg">+</button>
            </div>
            <button onClick={handleAddToCart} className="btn-primary flex-1 py-4">
              Agregar al carrito
            </button>
          </div>

          <button onClick={handleWishlist} className="btn-outline w-full py-3 flex items-center justify-center gap-2 mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            Guardar en wishlist
          </button>

          {/* Info strips */}
          <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
            <p>📦 Envío gratis en pedidos +$75</p>
            <p>↩️ Devoluciones en 14 días</p>
            <Link to="/shipping-returns" className="text-xs underline hover:text-gray-900">Ver política completa</Link>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-20 border-t pt-12">
        <h2 className="font-serif text-2xl font-bold mb-8">Reseñas ({reviews.length})</h2>
        <div className="grid md:grid-cols-2 gap-12">

          {/* Review list */}
          <div className="space-y-6">
            {reviews.length === 0 && <p className="text-gray-400 text-sm">Sé la primera en dejar una reseña.</p>}
            {reviews.map(r => (
              <div key={r._id} className="border-b pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <ReviewStars rating={r.rating} />
                  <span className="text-sm font-medium">{r.user?.name}</span>
                </div>
                <p className="text-sm text-gray-600">{r.body}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString('es-CR')}</p>
              </div>
            ))}
          </div>

          {/* Review form */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Deja tu reseña</h3>
            {!user ? (
              <p className="text-sm text-gray-500">
                <Link to="/login" className="underline hover:text-gray-900">Inicia sesión</Link> para dejar una reseña.
              </p>
            ) : (
              <form onSubmit={handleReview} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Calificación</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                        className={`text-2xl transition-colors ${n <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                      >★</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Comentario</label>
                  <textarea
                    value={reviewForm.body}
                    onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                    rows={4}
                    required
                    className="input resize-none"
                    placeholder="¿Qué te pareció la prenda?"
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary py-3 px-8">
                  {submitting ? 'Enviando...' : 'Enviar reseña'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {sizeGuide && <SizeGuideModal onClose={() => setSizeGuide(false)} />}
    </div>
  );
}
