import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const SORTS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const filters = {
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('search') || '',
    tag: searchParams.get('tag') || '',
    page: Number(searchParams.get('page') || 1),
  };

  const fetch = useCallback(async () => {
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

  useEffect(() => { fetch(); }, [fetch]);

  const handleFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (key === 'clear') {
      ['category', 'size', 'minPrice', 'maxPrice'].forEach(k => next.delete(k));
    } else if (value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete('page');
    setSearchParams(next);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
    window.scrollTo(0, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-bold">Collection</h1>
          {!loading && <p className="text-sm text-gray-500 mt-1">{total} producto{total !== 1 ? 's' : ''}</p>}
        </div>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Buscar..."
              value={filters.search}
              onChange={e => handleFilter('search', e.target.value)}
              className="input py-2 pl-9 pr-4 w-48 text-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          {/* Sort */}
          <select
            value={filters.sort}
            onChange={e => handleFilter('sort', e.target.value)}
            className="input py-2 text-sm w-auto"
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {/* Mobile filter toggle */}
          <button onClick={() => setFilterOpen(!filterOpen)} className="md:hidden btn-outline py-2 px-4 text-xs">
            Filtros
          </button>
        </div>
      </div>

      <div className="flex gap-10">
        {/* Sidebar */}
        <aside className={`md:block w-56 flex-shrink-0 ${filterOpen ? 'block' : 'hidden'}`}>
          <FilterSidebar filters={filters} onChange={handleFilter} />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200" />
                  <div className="mt-3 h-4 bg-gray-200 w-3/4" />
                  <div className="mt-2 h-3 bg-gray-200 w-1/4" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No se encontraron productos.</p>
              <button onClick={() => handleFilter('clear', '')} className="mt-4 text-sm underline hover:text-gray-700">Limpiar filtros</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 text-sm border transition-colors ${filters.page === p ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:border-gray-900'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
