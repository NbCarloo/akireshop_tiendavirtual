import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import ScrollReveal from '../components/ui/ScrollReveal';
import MagneticButton from '../components/ui/MagneticButton';
import RippleButton from '../components/ui/RippleButton';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/products?tag=new-arrival&limit=4').then(r => setNewArrivals(r.data.products));
    api.get('/products?tag=featured&limit=3').then(r => setFeatured(r.data.products));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gray-50 overflow-hidden min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid md:grid-cols-2 gap-12 items-center py-20">
          <ScrollReveal delay={0.1}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 mb-5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              New Drop
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight text-gray-900 mb-6">
              Timeless<br />essentials.
            </h1>
            <p className="text-gray-500 text-lg max-w-sm mb-10">
              Piezas frescas, femeninas y atemporales para todos los días.
            </p>
            <MagneticButton>
              <Link to="/collection" tabIndex={-1}>
                <RippleButton className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-full text-sm font-medium hover:bg-black hover:scale-[1.04] active:scale-[0.97] transition-all shadow-md hover:shadow-xl hover:shadow-black/20">
                  Ver colección
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </RippleButton>
              </Link>
            </MagneticButton>
          </ScrollReveal>

          <ScrollReveal delay={0.25} className="hidden md:block">
            <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
              {featured[0]?.colors?.[0]?.images?.[0] ? (
                <img
                  src={featured[0].colors[0].images[0]}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="font-serif text-5xl text-gray-300 font-bold">akire</span>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                ),
                title: 'Envíos a todo Costa Rica',
                desc: 'Rápidos y seguros',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                ),
                title: 'Pagos seguros',
                desc: 'Sinpe Móvil, transferencia y más',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
                title: 'Atención cercana',
                desc: 'Estamos para ayudarte',
              },
            ].map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.1}>
                <div className="flex items-center gap-4 px-6 py-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                    {v.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{v.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{v.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* New Drop */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-serif text-3xl font-bold text-gray-900">New Drop</h2>
              <Link to="/collection?tag=new-arrival" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Ver todo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((p, i) => (
              <ScrollReveal key={p._id} delay={i * 0.08}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <ScrollReveal>
        <Newsletter />
      </ScrollReveal>
    </div>
  );
}
