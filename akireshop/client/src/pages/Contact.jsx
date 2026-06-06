import { useState } from 'react';
import toast from 'react-hot-toast';

const TEMAS = ['Pedido', 'Producto', 'Talla', 'Devolución', 'Otro'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', email: '', subject: '', tema: '', message: '', privacy: false });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.privacy) return toast.error('Acepta la política de privacidad');
    setSent(true);
    toast.success('¡Mensaje enviado! Te contactaremos pronto.');
    setForm({ name: '', company: '', email: '', subject: '', tema: '', message: '', privacy: false });
  };

  const inputClass =
    'w-full border border-gray-200 bg-white/60 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors';
  const labelClass =
    'block text-[10px] font-semibold text-gray-500 mb-2 tracking-[0.06em] uppercase';

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">

      {/* Gradient mesh background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-rose-300/20 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 -right-20 w-[550px] h-[550px] bg-violet-400/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-fuchsia-300/10 rounded-full blur-[110px]" />
      </div>

      {/* Glass panel */}
      <div className="w-full max-w-2xl bg-white/75 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-black/5 px-6 py-10 sm:px-10 sm:py-12">

        {sent ? (
          <div className="flex flex-col items-center text-center py-10">
            <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold text-xl mb-1">¡Mensaje enviado!</p>
            <p className="text-gray-400 text-sm mb-6">Te responderemos en menos de 24 horas.</p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest">Contacto</p>
              <h1 className="text-3xl font-serif font-medium text-gray-900 leading-tight">
                ¿En qué podemos<br />ayudarte?
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre + Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nombre *</label>
                  <input className={inputClass} required placeholder="Nombre y Apellido" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Empresa / Proyecto</label>
                  <input className={inputClass} placeholder="Opcional" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" className={inputClass} required placeholder="tu@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>

              {/* Asunto */}
              <div>
                <label className={labelClass}>Asunto *</label>
                <input className={inputClass} required placeholder="¿De qué se trata?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} />
              </div>

              {/* Tema pills */}
              <div>
                <label className={labelClass}>Consulta sobre</label>
                <div className="flex flex-wrap gap-2">
                  {TEMAS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, tema: f.tema === t ? '' : t }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        form.tema === t
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white/60 text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label className={labelClass}>Mensaje *</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={5}
                  required
                  placeholder="Descríbenos tu consulta..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>

              {/* Privacy */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-4 h-4 mt-0.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${form.privacy ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover:border-gray-500'}`}>
                  {form.privacy && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input type="checkbox" className="sr-only" checked={form.privacy} onChange={e => setForm(f => ({ ...f, privacy: e.target.checked }))} />
                <span className="text-sm text-gray-500">
                  He leído y acepto la{' '}
                  <span className="font-semibold text-gray-900 underline underline-offset-2">Política de Privacidad</span>
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-900 active:scale-[0.99] text-white font-semibold py-4 rounded-lg text-sm tracking-widest uppercase transition-all"
              >
                Enviar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
