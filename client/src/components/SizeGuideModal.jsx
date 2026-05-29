export default function SizeGuideModal({ onClose }) {
  const sizes = [
    { size: 'XS', bust: '80–83', waist: '62–65', hip: '87–90' },
    { size: 'S',  bust: '84–87', waist: '66–69', hip: '91–94' },
    { size: 'M',  bust: '88–91', waist: '70–73', hip: '95–98' },
    { size: 'L',  bust: '92–96', waist: '74–78', hip: '99–103' },
    { size: 'XL', bust: '97–101', waist: '79–83', hip: '104–108' },
    { size: '2XL', bust: '102–107', waist: '84–89', hip: '109–114' },
    { size: '3XL', bust: '108–115', waist: '90–97', hip: '115–122' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <h2 className="font-serif text-xl font-bold">Guía de tallas</h2>
            <button onClick={onClose} className="p-1 hover:text-brand-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-gray-500 mb-4">Medidas en centímetros (cm)</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-semibold">Talla</th>
                  <th className="text-left py-2 font-semibold">Busto</th>
                  <th className="text-left py-2 font-semibold">Cintura</th>
                  <th className="text-left py-2 font-semibold">Cadera</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map(row => (
                  <tr key={row.size} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2 font-medium">{row.size}</td>
                    <td className="py-2 text-gray-600">{row.bust}</td>
                    <td className="py-2 text-gray-600">{row.waist}</td>
                    <td className="py-2 text-gray-600">{row.hip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-4">Si estás entre dos tallas, te recomendamos elegir la talla más grande.</p>
          </div>
        </div>
      </div>
    </>
  );
}
