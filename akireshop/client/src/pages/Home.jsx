import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import ScrollReveal from '../components/ui/ScrollReveal';

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    api.get('/products?tag=new-arrival&limit=4').then(r => setNewArrivals(r.data.products));
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-5rem)] bg-white flex flex-col items-center justify-center overflow-hidden">

        {/* Metadata top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute top-6 inset-x-0 flex items-center justify-between px-8 sm:px-14 pointer-events-none"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-gray-400">Costa Rica</span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-gray-400">SS 2025</span>
        </motion.div>

        {/* Logo reveal — masked slide-up */}
        <div className="flex flex-col items-center">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-serif font-medium leading-none tracking-tighter text-gray-900 select-none"
              style={{ fontSize: 'clamp(5.5rem, 19vw, 20rem)' }}
            >
              akire
            </motion.h1>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.92 }}
            className="text-[11px] uppercase tracking-[0.3em] text-gray-400 mt-5 mb-10"
          >
            Piezas femeninas · Atemporales · Costa Rica
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
            className="flex items-center gap-6"
          >
            <Link
              to="/collection"
              className="text-sm font-medium text-gray-900 border-b border-gray-900 pb-px hover:tracking-wider transition-all duration-300"
            >
              Ver colección
            </Link>
            <span className="w-px h-3 bg-gray-300" />
            <Link
              to="/collection?tag=new-arrival"
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors border-b border-transparent hover:border-gray-400 pb-px"
            >
              New Drop
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 1.7 }}
            className="w-px h-10 bg-gradient-to-b from-gray-300 to-transparent"
          />
        </motion.div>

        {/* Bottom divider — draws left to right */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          style={{ transformOrigin: 'left' }}
          className="absolute bottom-0 inset-x-0 h-px bg-gray-100"
        />
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
              { label: 'Envíos a todo Costa Rica', sub: 'Rápidos y seguros' },
              { label: 'Pagos seguros', sub: 'Sinpe Móvil, transferencia y más' },
              { label: 'Atención cercana', sub: 'Respondemos en menos de 24h' },
            ].map((v, i) => (
              <ScrollReveal key={v.label} delay={i * 0.08}>
                <div className="py-5 px-6 flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{v.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{v.sub}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW DROP ── */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Recién llegado</p>
                <h2 className="font-serif text-4xl font-medium text-gray-900 leading-tight">New Drop</h2>
              </div>
              <Link
                to="/collection?tag=new-arrival"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors border-b border-gray-200 hover:border-gray-900 pb-px"
              >
                Ver todo →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {newArrivals.map((p, i) => (
              <ScrollReveal key={p._id} delay={i * 0.07}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}

      {/* ── EDITORIAL STRIP ── */}
      <ScrollReveal>
        <section className="border-t border-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400 mb-4">Nuestra filosofía</p>
            <blockquote className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-gray-900 leading-tight max-w-3xl mx-auto">
              "Ropa que no grita.<br />Que susurra."
            </blockquote>
            <div className="w-8 h-px bg-gray-300 mx-auto mt-8" />
          </div>
        </section>
      </ScrollReveal>

      {/* ── NEWSLETTER ── */}
      <ScrollReveal>
        <Newsletter />
      </ScrollReveal>
    </div>
  );
}
