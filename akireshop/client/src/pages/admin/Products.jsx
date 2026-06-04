import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20, ...(search && { search }) };
      const { data } = await api.get('/products', { params: { ...params, isActive: undefined } });
      setProducts(data.products);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [page, search]);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Producto eliminado');
    fetch();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold">Productos</h1>
        <Link to="/admin/products/new" className="btn-primary py-2 px-5 text-sm">+ Agregar producto</Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          className="input max-w-xs text-sm py-2"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Cargando...</p>
      ) : (
        <div className="bg-white border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Producto</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Categoría</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Precio</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock total</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Tags</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map(p => {
                const stock = p.sizes?.reduce((s, sz) => s + sz.stock, 0) || 0;
                const image = p.colors?.[0]?.images?.[0];
                return (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {image ? (
                          <img src={image} alt={p.name} className="w-10 h-12 object-cover bg-gray-100 flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-12 bg-gray-100 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold">${(p.salePrice || p.price).toFixed(2)}</span>
                      {p.salePrice && <span className="text-xs text-gray-400 line-through ml-1">${p.price.toFixed(2)}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={stock < 5 ? 'text-orange-500 font-medium' : 'text-gray-600'}>{stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.tags?.map(t => (
                          <span key={t} className="badge bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 justify-end">
                        <Link to={`/admin/products/edit/${p._id}`} className="text-xs text-blue-600 hover:underline">Editar</Link>
                        <button onClick={() => handleDelete(p._id)} className="text-xs text-red-500 hover:underline">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex gap-2 mt-6">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 text-sm border transition-colors ${page === p ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:border-gray-900'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
