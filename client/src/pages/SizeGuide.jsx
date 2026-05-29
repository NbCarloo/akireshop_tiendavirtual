import SizeGuideModal from '../components/SizeGuideModal';
import { Link } from 'react-router-dom';

const sizes = [
  { size: 'XS', bust: '80–83', waist: '62–65', hip: '87–90' },
  { size: 'S',  bust: '84–87', waist: '66–69', hip: '91–94' },
  { size: 'M',  bust: '88–91', waist: '70–73', hip: '95–98' },
  { size: 'L',  bust: '92–96', waist: '74–78', hip: '99–103' },
  { size: 'XL', bust: '97–101', waist: '79–83', hip: '104–108' },
  { size: '2XL', bust: '102–107', waist: '84–89', hip: '109–114' },
  { size: '3XL', bust: '108–115', waist: '90–97', hip: '115–122' },
];

export default function SizeGuide() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="text-xs text-gray-400 mb-8 flex gap-2">
        <Link to="/" className="hover:text-gray-700">Inicio</Link>
        <span>/</span>
        <span className="text-gray-700">Guía de tallas</span>
      </nav>
      <h1 className="font-serif text-4xl font-bold mb-4">Guía de tallas</h1>
      <p className="text-gray-600 mb-10">Todas las medidas están en centímetros (cm). Si estás entre dos tallas, elige la más grande para mayor comodidad.</p>

      <h2 className="font-semibold text-lg mb-4">Cómo medirte</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-12 text-sm text-gray-600">
        {[
          { label: 'Busto', desc: 'Mide alrededor de la parte más ancha del pecho, manteniendo la cinta horizontal.' },
          { label: 'Cintura', desc: 'Mide alrededor de la parte más estrecha de tu torso, generalmente sobre el ombligo.' },
          { label: 'Cadera', desc: 'Mide alrededor de la parte más ancha de tus caderas.' },
        ].map(m => (
          <div key={m.label} className="bg-gray-50 p-5">
            <h3 className="font-semibold text-gray-900 mb-2">{m.label}</h3>
            <p>{m.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="font-semibold text-lg mb-4">Tabla de tallas</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left px-4 py-3 font-semibold">Talla</th>
              <th className="text-left px-4 py-3 font-semibold">Busto (cm)</th>
              <th className="text-left px-4 py-3 font-semibold">Cintura (cm)</th>
              <th className="text-left px-4 py-3 font-semibold">Cadera (cm)</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((row, i) => (
              <tr key={row.size} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium">{row.size}</td>
                <td className="px-4 py-3 text-gray-600">{row.bust}</td>
                <td className="px-4 py-3 text-gray-600">{row.waist}</td>
                <td className="px-4 py-3 text-gray-600">{row.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
