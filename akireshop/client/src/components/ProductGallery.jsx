import { useState } from 'react';

export default function ProductGallery({ colors, selectedColor, onColorChange }) {
  const color = colors.find(c => c.name === selectedColor) || colors[0];
  const images = color?.images || [];
  const [active, setActive] = useState(0);

  if (!images.length) {
    return <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center text-gray-300 text-sm">Sin imágenes</div>;
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[560px]">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-20 border-2 transition-colors ${active === i ? 'border-gray-900' : 'border-transparent hover:border-gray-300'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="flex-1 aspect-[3/4] bg-gray-100 overflow-hidden">
        <img src={images[active]} alt={color?.name} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
