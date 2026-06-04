import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production: send to backend / email service
    setSent(true);
    toast.success('¡Mensaje enviado! Te contactaremos pronto.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl font-bold mb-3">Contacto</h1>
      <p className="text-gray-600 mb-10">¿Tienes alguna pregunta, comentario o problema con tu pedido? Escríbenos y te respondemos a la brevedad.</p>

      {sent ? (
        <div className="bg-green-50 border border-green-200 p-6 text-center">
          <p className="text-green-700 font-medium">¡Mensaje enviado con éxito!</p>
          <p className="text-sm text-green-600 mt-1">Te responderemos en menos de 24 horas.</p>
          <button onClick={() => setSent(false)} className="mt-4 text-sm underline text-green-700">Enviar otro mensaje</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Nombre</label>
              <input className="input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input className="input" type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Mensaje</label>
            <textarea
              className="input resize-none"
              rows={6}
              required
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder="¿En qué podemos ayudarte?"
            />
          </div>
          <button type="submit" className="btn-primary py-4 px-10">Enviar mensaje</button>
        </form>
      )}

      <div className="mt-12 pt-8 border-t">
        <h2 className="font-semibold mb-4">También puedes encontrarnos en:</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>📧 <a href="mailto:hola@akireshopcr.com" className="hover:text-brand-500">hola@akireshopcr.com</a></p>
          <p>📱 Instagram: <a href="https://instagram.com/akireshopcr" target="_blank" rel="noreferrer" className="hover:text-brand-500">@akireshopcr</a></p>
        </div>
      </div>
    </div>
  );
}
