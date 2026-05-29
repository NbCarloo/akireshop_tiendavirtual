export default function FilterSidebar({ filters, onChange }) {
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Swimwear', 'Loungewear'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

  const toggle = (key, value) => {
    onChange(key, filters[key] === value ? '' : value);
  };

  return (
    <aside className="space-y-8 text-sm">
      {/* Category */}
      <div>
        <h3 className="font-semibold uppercase tracking-widest text-xs mb-3">Categoría</h3>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat}>
              <button
                onClick={() => toggle('category', cat)}
                className={`block w-full text-left py-1 transition-colors ${filters.category === cat ? 'text-brand-500 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-semibold uppercase tracking-widest text-xs mb-3">Talla</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map(s => (
            <button
              key={s}
              onClick={() => toggle('size', s)}
              className={`w-12 h-10 border text-xs font-medium transition-colors ${filters.size === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:border-gray-900'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-semibold uppercase tracking-widest text-xs mb-3">Precio</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice || ''}
            onChange={e => onChange('minPrice', e.target.value)}
            className="input w-24 text-xs py-2"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice || ''}
            onChange={e => onChange('maxPrice', e.target.value)}
            className="input w-24 text-xs py-2"
          />
        </div>
      </div>

      {/* Clear */}
      {(filters.category || filters.size || filters.minPrice || filters.maxPrice) && (
        <button
          onClick={() => onChange('clear', '')}
          className="text-xs text-gray-400 underline hover:text-gray-700"
        >
          Limpiar filtros
        </button>
      )}
    </aside>
  );
}
