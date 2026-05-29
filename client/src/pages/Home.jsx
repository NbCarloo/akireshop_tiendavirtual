import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?tag=new-arrival&limit=4').then(r => setNewArrivals(r.data.products));
    api.get('/products?tag=trending&limit=4').then(r => setTrending(r.data.products));
    api.get('/products?tag=featured&limit=3').then(r => setFeatured(r.data.products));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gray-100 overflow-hidden min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid md:grid-cols-2 gap-8 items-center py-20">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500 mb-4 block">Nueva temporada</span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-6">
              Moda que<br />te define.
            </h1>
            <p className="text-gray-600 text-lg max-w-md mb-8">
              Piezas cuidadosamente seleccionadas para la mujer joven y auténtica. Envíos a todo el país.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/collection" className="btn-primary py-4 px-8 text-base">Ver Collection</Link>
              <Link to="/collection?tag=new-arrival" className="btn-outline py-4 px-8 text-base">New Arrivals</Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] bg-gray-200 overflow-hidden hidden md:block">
            {featured[0]?.colors?.[0]?.images?.[0] ? (
              <img src={featured[0].colors[0].images[0]} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                <span className="font-serif text-4xl text-brand-400 font-bold">akire</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured collections */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl font-bold">Destacadas</h2>
            <Link to="/collection?tag=featured" className="text-sm underline hover:text-brand-500">Ver todas</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Banner strip */}
      <section className="bg-brand-500 text-white py-12 px-4 text-center">
        <p className="font-serif text-2xl md:text-3xl font-bold mb-2">Envío gratis en pedidos +$75</p>
        <p className="text-brand-100 text-sm mb-6">Aplica a todo el país. Sin código necesario.</p>
        <Link to="/collection" className="inline-block bg-white text-brand-500 px-8 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-brand-50 transition-colors">
          Comprar ahora
        </Link>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl font-bold">New Arrivals</h2>
            <Link to="/collection?tag=new-arrival" className="text-sm underline hover:text-brand-500">Ver todas</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-3xl font-bold">Trending</h2>
              <Link to="/collection?tag=trending" className="text-sm underline hover:text-brand-500">Ver todas</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {trending.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Values strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '📦', title: 'Envío rápido', desc: 'Procesamos tu pedido en 24–48 horas.' },
            { icon: '↩️', title: 'Devoluciones fáciles', desc: '14 días para cambios sin complicaciones.' },
            { icon: '🔒', title: 'Pago seguro', desc: 'Tus datos siempre protegidos con Stripe.' },
          ].map(v => (
            <div key={v.title} className="flex flex-col items-center gap-3">
              <span className="text-3xl">{v.icon}</span>
              <h3 className="font-semibold text-lg">{v.title}</h3>
              <p className="text-sm text-gray-500">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
