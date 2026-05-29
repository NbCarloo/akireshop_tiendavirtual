import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-5xl font-bold mb-6">Sobre nosotras</h1>
      <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-6">
        <p className="text-xl text-gray-800 font-medium">
          akireshopcr nació de una pasión por la moda auténtica, accesible y pensada para la mujer joven de hoy.
        </p>
        <p>
          Somos una tienda en línea dedicada a ofrecer prendas cuidadosamente seleccionadas para mujeres entre 16 y 25 años. Creemos que la moda es una forma de expresión, no un privilegio, y por eso trabajamos para que cada pieza sea tanto hermosa como asequible.
        </p>
        <p>
          Operamos completamente en línea, enviando a todo el país con el compromiso de hacer tu experiencia de compra sencilla, segura y placentera.
        </p>
        <div className="grid md:grid-cols-3 gap-6 not-prose mt-10">
          {[
            { num: '100%', label: 'Online' },
            { num: '14d', label: 'Devoluciones' },
            { num: '24h', label: 'Envío express' },
          ].map(s => (
            <div key={s.label} className="text-center border p-6">
              <p className="font-serif text-3xl font-bold text-brand-500">{s.num}</p>
              <p className="text-sm text-gray-600 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-8">
          ¿Tienes alguna pregunta? <Link to="/contact" className="text-brand-500 underline">Escríbenos</Link>. Siempre estamos disponibles para ayudarte.
        </p>
      </div>
    </div>
  );
}
