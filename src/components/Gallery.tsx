import { useState } from 'react';
import Image from 'next/image';

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      setSelectedImage(index);
    }
  };

  const handleImageChange = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative aspect-square">
        <Image
          src={images[selectedImage]}
          alt="Selected product"
          className="w-full h-full object-cover rounded-lg"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          placeholder="blur"
          blurDataURL="/placeholder.png"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageChange(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`relative aspect-square focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selectedImage === index ? 'ring-2 ring-blue-500' : ''
            }`}
            aria-label={`View image ${index + 1}`}
            tabIndex={0}
          >
            <Image
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              placeholder="blur"
              blurDataURL="/placeholder.png"
            />
          </button>
        ))}
      </div>
    </div>
  );
}