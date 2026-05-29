import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletter = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/newsletter', { email });
      toast.success('¡Suscrita! 🎉');
      setEmail('');
    } catch {
      toast.error('Hubo un error. Intenta de nuevo.');
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <h3 className="font-serif text-xl font-bold mb-3">akireshopcr</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Moda femenina hecha para mujeres jóvenes y apasionadas por el estilo.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Tienda</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/collection" className="hover:text-white transition-colors">Collection</Link></li>
            <li><Link to="/collection?tag=new-arrival" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/collection?tag=sale" className="hover:text-white transition-colors">Sale</Link></li>
            <li><Link to="/size-guide" className="hover:text-white transition-colors">Guía de tallas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Ayuda</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Envíos y devoluciones</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contacto</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Sobre nosotras</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest mb-4">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-3">Sé la primera en enterarte de nuevas piezas y descuentos.</p>
          <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="bg-gray-800 text-white text-sm px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            <button type="submit" className="btn-primary py-3">Suscribirme</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} akireshopcr. Todos los derechos reservados.
      </div>
    </footer>
  );
}
