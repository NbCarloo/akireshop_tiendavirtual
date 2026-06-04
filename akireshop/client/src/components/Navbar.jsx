import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import {
  ExpandableScreen,
  ExpandableScreenTrigger,
  ExpandableScreenContent,
} from './ui/ExpandableScreen';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast.success('¡Mensaje enviado! Te contactaremos pronto.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h2 className="font-serif text-4xl font-bold text-white mb-2">Contacto</h2>
      <p className="text-gray-400 mb-10">¿Tienes alguna pregunta o comentario? Escríbenos y te respondemos a la brevedad.</p>

      {sent ? (
        <div className="bg-white/10 border border-white/20 p-6 text-center rounded-lg">
          <p className="text-white font-medium">¡Mensaje enviado con éxito!</p>
          <p className="text-sm text-gray-300 mt-1">Te responderemos en menos de 24 horas.</p>
          <button onClick={() => setSent(false)} className="mt-4 text-sm underline text-gray-300 hover:text-white">
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1 text-gray-300">Nombre</label>
              <input
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1 text-gray-300">Email</label>
              <input
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors"
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1 text-gray-300">Mensaje</label>
            <textarea
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors resize-none"
              rows={5}
              required
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="¿En qué podemos ayudarte?"
            />
          </div>
          <button type="submit" className="bg-white text-gray-900 font-medium py-3.5 px-10 hover:bg-gray-100 transition-colors text-sm tracking-wide uppercase">
            Enviar mensaje
          </button>
        </form>
      )}

      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-sm font-semibold text-gray-300 mb-3">También puedes encontrarnos en:</p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>✉️ <a href="mailto:hola@akire.cr" className="hover:text-white transition-colors">hola@akire.cr</a></p>
          <p>📱 Instagram: <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">@akire</a></p>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, setOpen } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-gray-900">
            akire
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <NavLink to="/collection?tag=new-arrival" className={({ isActive }) => `nav-link transition-colors ${isActive ? 'text-gray-900 font-semibold active' : 'hover:text-gray-900'}`}>
              New Drop
            </NavLink>
            <NavLink to="/collection" end className={({ isActive }) => `nav-link transition-colors ${isActive ? 'text-gray-900 font-semibold active' : 'hover:text-gray-900'}`}>
              Shop
            </NavLink>
            <NavLink to="/collection?tag=trending" className={({ isActive }) => `nav-link transition-colors ${isActive ? 'text-gray-900 font-semibold active' : 'hover:text-gray-900'}`}>
              Best Sellers
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link transition-colors ${isActive ? 'text-gray-900 font-semibold active' : 'hover:text-gray-900'}`}>
              Información
            </NavLink>

            {/* Contacto con ExpandableScreen */}
            <ExpandableScreen layoutId="contact-screen" triggerRadius="100px" contentRadius="20px">
              <ExpandableScreenTrigger>
                <span className="inline-flex items-center gap-1.5 bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-black transition-colors cursor-pointer">
                  Contacto
                </span>
              </ExpandableScreenTrigger>
              <ExpandableScreenContent className="bg-gray-900" closeButtonClassName="bg-white/10 hover:bg-white/20 text-white">
                <ContactForm />
              </ExpandableScreenContent>
            </ExpandableScreen>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <Link to="/collection" className="p-1.5 hover:text-gray-600 transition-colors" aria-label="Buscar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </Link>

            <Link to="/wishlist" className="p-1.5 hover:text-gray-600 transition-colors" aria-label="Wishlist">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>

            <button onClick={() => setOpen(true)} className="flex items-center gap-1 p-1.5 hover:text-gray-600 transition-colors" aria-label="Carrito">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
              <span className="text-xs font-medium">({totalItems})</span>
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-3 text-sm ml-1">
                <Link to="/profile" className="hover:text-gray-600 transition-colors">{user.name.split(' ')[0]}</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="font-medium text-gray-900">Admin</Link>
                )}
                <button onClick={handleLogout} className="hover:text-gray-600 transition-colors text-xs">Salir</button>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium">
            <NavLink to="/collection?tag=new-arrival" onClick={() => setMenuOpen(false)}>New Drop</NavLink>
            <NavLink to="/collection" end onClick={() => setMenuOpen(false)}>Shop</NavLink>
            <NavLink to="/collection?tag=trending" onClick={() => setMenuOpen(false)}>Best Sellers</NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>Información</NavLink>
            <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contacto</NavLink>
            <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</NavLink>
            {user ? (
              <>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)}>Mi cuenta</NavLink>
                {user.role === 'admin' && <NavLink to="/admin" onClick={() => setMenuOpen(false)}>Admin</NavLink>}
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-left">Salir</button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMenuOpen(false)}>Entrar</NavLink>
                <NavLink to="/register" onClick={() => setMenuOpen(false)}>Registrarse</NavLink>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
