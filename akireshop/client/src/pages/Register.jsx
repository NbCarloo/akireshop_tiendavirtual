import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return toast.error('La contraseña debe tener al menos 8 caracteres');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('¡Cuenta creada! Bienvenida 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white w-full max-w-md p-8 shadow-sm">
        <h1 className="font-serif text-3xl font-bold text-center mb-2">Crear cuenta</h1>
        <p className="text-center text-sm text-gray-500 mb-8">Únete a la comunidad akireshopcr</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input"
            placeholder="Nombre completo"
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <input
            className="input"
            type="password"
            placeholder="Contraseña (mín. 8 caracteres)"
            required
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full py-4">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="underline hover:text-gray-900">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
