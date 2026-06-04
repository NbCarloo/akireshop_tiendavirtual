import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import api from '../api';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ui/ScrollReveal';
import DropdownSelect from '../components/ui/DropdownSelect';

const SORTS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
];

const CATEGORIES = ['Todos', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Swimwear', 'Loungewear'];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const filters = {
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    tag: searchParams.get('tag') || '',
    page: Number(searchParams.get('page') || 1),
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [searchParams.toString()]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'Todos') next.delete('category');
    else next.set('category', cat);
    next.delete('page');
    setSearchParams(next);
  };

  const setSort = (val) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', val);
    next.delete('page');
    setSearchParams(next);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeCategory = filters.category || 'Todos';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <ScrollReveal>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-serif text-5xl font-bold text-gray-900">Collection</h1>
            {!loading && (
              <p className="text-sm text-gray-400 mt-2">{total} pieza{total !== 1 ? 's' : ''}</p>
            )}
          </div>
          <DropdownSelect
            options={SORTS}
            value={filters.sort}
            onChange={setSort}
          />
        </div>
      </ScrollReveal>

      {/* Category filter — sliding indicator pills */}
      <ScrollReveal delay={0.05}>
        <div className="flex items-center gap-2 flex-wrap mb-10 pb-6 border-b border-gray-100">
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`relative text-xs px-4 py-1.5 rounded-full border transition-colors duration-150 ${
                activeCategory === cat
                  ? 'text-white border-transparent'
                  : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400'
              }`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="pill-bg"
                  className="absolute inset-0 bg-gray-900 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </motion.button>
          ))}
        </div>
      </ScrollReveal>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100" />
                <div className="mt-3 h-3 bg-gray-100 w-3/4" />
                <div className="mt-2 h-3 bg-gray-100 w-1/3" />
              </div>
            ))}
          </motion.div>
        ) : products.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-28 text-gray-400"
          >
            <p className="font-serif text-2xl text-gray-300 mb-3">Sin resultados</p>
            <p className="text-sm">No hay piezas en esta categoría todavía.</p>
            <button onClick={() => setCategory('Todos')} className="mt-5 text-xs underline underline-offset-4 hover:text-gray-700 transition-colors">
              Ver todas las piezas
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`grid-${filters.category}-${filters.page}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((p, i) => (
                <ScrollReveal key={p._id} delay={i * 0.05}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-16">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs transition-all duration-200 ${
                      filters.page === p
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
