import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, onPrev, onNext]);

  return (
    <div className="w-full overflow-hidden">
      <div className="relative bg-white rounded-none shadow-sm overflow-hidden w-full">
        {images[currentIndex] ? (
          <img
            src={getImageUrl(images[currentIndex], 'main') || ''}
            alt="car"
            onClick={() => setIsLightboxOpen(true)}
            className="w-full h-auto aspect-[4/3] object-cover cursor-pointer hover:opacity-95 transition-opacity block"
          />
        ) : (
          <img
            src={'https://www.shutterstock.com/image-vector/flat-car-picture-placeholder-symbol-600nw-2366856295.jpg'}
            alt="car"
            className="w-full h-auto aspect-[4/3] object-cover block"
          />
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-none p-2 shadow-md z-10"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-none p-2 shadow-md z-10"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex space-x-3 overflow-x-auto no-scrollbar pb-2 w-full">
          {images.map((image: CarImage, index: number) => (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-none overflow-hidden border-2 transition-colors duration-200 ${index === currentIndex ? 'border-indigo-600' : 'border-transparent hover:border-gray-300'}`}
            >
              <img src={getImageUrl(image, 'thumb')} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm p-4" onClick={() => setIsLightboxOpen(false)}>
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-white/10 p-2 rounded-none transition-colors z-50"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative w-full max-w-7xl h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onPrev(); }}
                className="absolute left-2 sm:left-4 text-white hover:text-gray-300 bg-black/20 hover:bg-black/40 p-2 rounded-none transition-colors z-50"
              >
                <ChevronLeft className="h-8 w-8 sm:h-12 sm:w-12" />
              </button>
            )}

            {images[currentIndex] && (
              <img
                src={getImageUrl(images[currentIndex], 'main') || ''}
                alt="Full screen car"
                className="max-h-[90vh] max-w-full object-contain select-none"
              />
            )}

            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); onNext(); }}
                className="absolute right-2 sm:right-4 text-white hover:text-gray-300 bg-black/20 hover:bg-black/40 p-2 rounded-none transition-colors z-50"
              >
                 <ChevronRight className="h-8 w-8 sm:h-12 sm:w-12" />
              </button>
            )}
            
            {/* Image counter in lightbox */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1 rounded-none text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsGallery;
