import { useState } from 'react';

export default function Gallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div>
      <img
        src={images[selected]}
        alt={`Gambar ${selected + 1}`}
        className="w-full h-64 object-cover rounded mb-2 border"
      />
      {images.length > 1 && (
        <div className="flex gap-2 mt-2">
          {images.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt={`Thumb ${idx + 1}`}
              className={`w-16 h-16 object-cover rounded cursor-pointer border ${selected === idx ? 'border-blue-500' : 'border-gray-300'}`}
              onClick={() => setSelected(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}