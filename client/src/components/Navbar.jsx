import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="akireshopcr" className="h-8 w-auto" onError={e => { e.target.style.display='none'; }} />
          <span className="font-serif text-xl font-bold tracking-tight">akireshopcr</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink to="/collection" className={({ isActive }) => isActive ? 'text-brand-500' : 'hover:text-brand-500 transition-colors'}>
            Collection
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'text-brand-500' : 'hover:text-brand-500 transition-colors'}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-brand-500' : 'hover:text-brand-500 transition-colors'}>
            Contact
          </NavLink>
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-4 text-sm">
              <Link to="/profile" className="hover:text-brand-500 transition-colors">{user.name.split(' ')[0]}</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-brand-500 font-medium">Admin</Link>
              )}
              <button onClick={handleLogout} className="hover:text-brand-500 transition-colors">Salir</button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4 text-sm">
              <Link to="/login" className="hover:text-brand-500 transition-colors">Entrar</Link>
              <Link to="/register" className="btn-primary py-2 px-4">Registrarse</Link>
            </div>
          )}

          <Link to="/wishlist" className="relative p-1 hover:text-brand-500 transition-colors" aria-label="Wishlist">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </Link>

          <button onClick={() => setOpen(true)} className="relative p-1 hover:text-brand-500 transition-colors" aria-label="Cart">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
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
          <NavLink to="/collection" onClick={() => setMenuOpen(false)}>Collection</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
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
  );
}
