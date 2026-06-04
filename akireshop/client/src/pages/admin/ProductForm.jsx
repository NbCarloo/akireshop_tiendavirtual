import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Swimwear', 'Loungewear'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const TAGS = ['new-arrival', 'trending', 'sale', 'featured'];

const defaultForm = {
  name: '', description: '', price: '', salePrice: '',
  category: 'Tops', tags: [],
  sizes: SIZES.map(s => ({ size: s, stock: 0 })),
  colors: [{ name: '', hex: '#000000', images: [] }],
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/products`).then(r => {
        const p = r.data.products.find(x => x._id === id);
        if (p) setForm({ ...p, price: p.price.toString(), salePrice: p.salePrice?.toString() || '' });
      });
    }
  }, [id]);

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleTag = (tag) => {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }));
  };

  const setStock = (size, stock) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.map(s => s.size === size ? { ...s, stock: Number(stock) } : s),
    }));
  };

  const setColorField = (i, key, val) => {
    setForm(f => {
      const colors = [...f.colors];
      colors[i] = { ...colors[i], [key]: val };
      return { ...f, colors };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
      }));
      files.forEach(f => formData.append('images', f));

      if (isEdit) {
        await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Producto actualizado');
      } else {
        await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Producto creado');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="font-serif text-3xl font-bold mb-8">{isEdit ? 'Editar producto' : 'Nuevo producto'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <section className="bg-white border p-6 space-y-4">
          <h2 className="font-semibold mb-2">Información básica</h2>
          <div>
            <label className="text-sm font-medium block mb-1">Nombre *</label>
            <input className="input" required value={form.name} onChange={e => setField('name', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Descripción *</label>
            <textarea className="input resize-none" rows={4} required value={form.description} onChange={e => setField('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Precio *</label>
              <input className="input" type="number" step="0.01" required value={form.price} onChange={e => setField('price', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Precio de oferta</label>
              <input className="input" type="number" step="0.01" value={form.salePrice} onChange={e => setField('salePrice', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Categoría *</label>
              <select className="input" value={form.category} onChange={e => setField('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="bg-white border p-6">
          <h2 className="font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {TAGS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={`px-4 py-2 text-sm border transition-colors ${form.tags.includes(t) ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:border-gray-900'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Sizes & stock */}
        <section className="bg-white border p-6">
          <h2 className="font-semibold mb-4">Tallas y stock</h2>
          <div className="grid grid-cols-4 gap-3">
            {form.sizes.map(s => (
              <div key={s.size}>
                <label className="text-xs font-medium block mb-1">{s.size}</label>
                <input
                  className="input text-sm py-2"
                  type="number"
                  min="0"
                  value={s.stock}
                  onChange={e => setStock(s.size, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="bg-white border p-6">
          <h2 className="font-semibold mb-4">Colores</h2>
          {form.colors.map((c, i) => (
            <div key={i} className="flex items-center gap-4 mb-3">
              <input
                className="input flex-1 text-sm py-2"
                placeholder="Nombre del color"
                value={c.name}
                onChange={e => setColorField(i, 'name', e.target.value)}
              />
              <input type="color" value={c.hex} onChange={e => setColorField(i, 'hex', e.target.value)} className="w-10 h-10 border border-gray-300 cursor-pointer" />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, colors: [...f.colors, { name: '', hex: '#000000', images: [] }] }))}
            className="text-sm text-brand-500 underline"
          >
            + Agregar color
          </button>
        </section>

        {/* Images */}
        <section className="bg-white border p-6">
          <h2 className="font-semibold mb-4">Imágenes</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={e => setFiles(Array.from(e.target.files))}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          {files.length > 0 && <p className="text-xs text-gray-500 mt-2">{files.length} imagen(s) seleccionada(s)</p>}
        </section>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary py-3 px-8">
            {loading ? 'Guardando...' : isEdit ? 'Actualizar producto' : 'Crear producto'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline py-3 px-8">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
