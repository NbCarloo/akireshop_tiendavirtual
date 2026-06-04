import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import RippleButton from './ui/RippleButton';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/newsletter', { email });
      toast.success('¡Suscrita! Revisa tu correo.');
      setEmail('');
    } catch {
      toast.error('Hubo un error. Intenta de nuevo.');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="border-2 border-dashed border-gray-200 rounded-xl px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">10% OFF en tu primera compra</p>
            <p className="text-sm text-gray-500 mt-0.5">Suscríbete y recibe tu código de bienvenida.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-0">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
            className="flex-1 md:w-72 border border-gray-300 border-r-0 px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-colors"
          />
          <RippleButton
            type="submit"
            className="bg-gray-900 text-white px-6 py-3 text-sm font-medium hover:bg-black hover:scale-[1.03] active:scale-[0.97] transition-all whitespace-nowrap"
          >
            Suscribirme
          </RippleButton>
        </form>
      </div>
    </section>
  );
}
