import { Link } from 'react-router-dom';

export default function ShippingReturns() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl font-bold mb-10">Envíos y devoluciones</h1>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold mb-4">Envíos</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div className="border-l-4 border-brand-400 pl-4">
            <p className="font-semibold text-gray-900">Envío estándar</p>
            <p>Entrega en 3–5 días hábiles. Costo: $5.99. <strong>Gratis en pedidos mayores a $75.</strong></p>
          </div>
          <div className="border-l-4 border-brand-400 pl-4">
            <p className="font-semibold text-gray-900">Envío express</p>
            <p>Entrega en 1–2 días hábiles. Costo: $12.99.</p>
          </div>
          <p>Todos los pedidos son procesados en 24–48 horas. Una vez enviado, recibirás un correo con el número de seguimiento.</p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-serif text-2xl font-bold mb-4">Devoluciones y cambios</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>Aceptamos devoluciones dentro de los <strong>14 días calendario</strong> después de recibir tu pedido.</p>
          <p>Para que aplique la devolución:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>La prenda debe estar sin usar, con etiquetas originales.</li>
            <li>No debe haber sido lavada ni alterada.</li>
            <li>Prendas en liquidación (sale) no son elegibles para devolución.</li>
          </ul>
          <p>Para iniciar una devolución, <Link to="/contact" className="text-brand-500 underline">contáctanos</Link> con tu número de pedido.</p>
          <p>El costo del envío de devolución corre por cuenta del cliente, excepto en casos de producto defectuoso.</p>
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl font-bold mb-4">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {[
            { q: '¿Cuánto tarda mi pedido?', a: 'Procesamos en 24–48h. El tiempo de entrega depende del tipo de envío elegido (3–5 días estándar).' },
            { q: '¿Puedo cambiar la talla?', a: 'Sí, dentro de los 14 días si el producto no ha sido usado. Contáctanos para coordinar el cambio.' },
            { q: '¿Mi pago es seguro?', a: 'Sí. Todos los pagos son procesados por Stripe, uno de los sistemas de pago más seguros del mundo.' },
          ].map(faq => (
            <div key={faq.q} className="border p-5">
              <p className="font-semibold text-sm">{faq.q}</p>
              <p className="text-sm text-gray-600 mt-1">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
