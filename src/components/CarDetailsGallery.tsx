import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CarImage } from '../services/api';

interface Props {
  images: CarImage[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

function getImageUrl(img: CarImage, kind: 'main' | 'thumb'): string {
  const dyn = img as unknown as Record<string, unknown>;
  const key = kind === 'main' ? 'urlMain' : 'urlThumb';
  const dynUrl = typeof dyn[key] === 'string' ? (dyn[key] as string) : undefined;
  return dynUrl ?? img.storageBaseKey ?? '';
}

const CarDetailsGallery: React.FC<Props> = ({ images, currentIndex, onPrev, onNext, onSelect }) => {
  return (
    <div>
      <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden">
        {images[currentIndex] ? (
          <img
            src={getImageUrl(images[currentIndex], 'main') || ''}
            alt="car"
            className="w-full h-80 sm:h-96 object-cover"
          />
        ) : (
          <img
            src={'https://www.shutterstock.com/image-vector/flat-car-picture-placeholder-symbol-600nw-2366856295.jpg'}
            alt="car"
            className="w-full h-80 sm:h-96 object-cover"
          />
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex space-x-3 overflow-x-auto pb-2">
          {images.map((image: CarImage, index: number) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors duration-200 ${index === currentIndex ? 'border-blue-600' : 'border-transparent hover:border-gray-300'}`}
            >
              <img src={getImageUrl(image, 'thumb')} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarDetailsGallery;
