import React, { useState } from 'react';
import { useGetApiBuildTypes } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BrowseCarByBuildTypes: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const isMyanmar = i18n?.language?.startsWith('mm');
  const { data: buildTypes = [], isLoading, isError } = useGetApiBuildTypes();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback image source if API doesn't provide one
  const fallbackImage = 'https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % buildTypes.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + buildTypes.length) % buildTypes.length);
  };

  const handleBuildTypeClick = (buildTypeName: string) => {
    // Navigate to BuyCars page with buildType filter
    navigate(`/buyCars?buildType=${encodeURIComponent(buildTypeName)}`);
  };

  const getCardStyle = (index: number) => {
    const offset = index - activeIndex;
    const total = buildTypes.length;

    // Handle wrapping for a seamless loop
    let adjustedOffset = offset;
    if (offset > total / 2) {
      adjustedOffset = offset - total;
    } else if (offset < -total / 2) {
      adjustedOffset = offset + total;
    }

    const isCenter = adjustedOffset === 0;
    const isAdjacent = Math.abs(adjustedOffset) === 1;
    // const isHidden = Math.abs(adjustedOffset) > 1;

    const scale = isCenter ? 1.1 : 0.8;
    const opacity = isCenter ? 1 : isAdjacent ? 0.7 : 0;
    const zIndex = isCenter ? 20 : isAdjacent ? 10 : 0;
    const translateX = isCenter ? '0%' : `${adjustedOffset * 30}%`; // Adjust multiplier for spacing

    return {
      transform: `translateX(${translateX}) scale(${scale})`,
      opacity: opacity,
      zIndex: zIndex,
      transition: 'transform 0.5s ease, opacity 0.5s ease',
      position: 'absolute' as const,
      width: '100%',
    };
  };

  return (
    <section className="py-2 lg:py-3 relative overflow-hidden bg-transparent">
        {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-50/50 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-50/30 blur-[120px] -z-10" />

      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3">
        <div className="bg-white rounded-none p-3 sm:p-6 lg:p-8 shadow-2xl shadow-slate-200/40 border border-white relative overflow-hidden">
        
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
                <LayoutGrid className="w-3 h-3 fill-indigo-700" />
                Vehicle Categories
              </div>
              <h2 className={`text-2xl lg:text-4xl font-black text-slate-900 tracking-tight ${isMyanmar ? 'font-myanmar text-[1.45rem] lg:text-[2.1rem] max-sm:text-[1.65rem] leading-[1.6]' : 'leading-[1.4]'}`}>
                {isMyanmar ? (
                  <>
                    <span className="inline-block pt-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      {t('browse_by_body_type.highlightedText')}
                    </span>{" "}
                    {t('browse_by_body_type.title')}
                  </>
                ) : (
                  <>
                    {t('browse_by_body_type.title')}{" "}
                    <span className="inline-block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      {t('browse_by_body_type.highlightedText')}
                    </span>
                  </>
                )}
              </h2>
            </div>
          </div>

          {/* Carousel Content */}
          {!isLoading && !isError && buildTypes.length > 0 && (
            <div className="relative h-[420px] flex items-center justify-center z-10">
              {/* Carousel items container */}
              <div className="absolute inset-0 flex items-center justify-center">
                {buildTypes.map((type, index) => (
                  <div 
                    key={type.id}
                    style={getCardStyle(index)}
                    onClick={() => index === activeIndex && handleBuildTypeClick(type.name)}
                    className="flex-shrink-0 w-full max-w-[340px] group flex flex-col items-center text-center gap-4"
                  >
                    {/* Card Wrapper */}
                    <div className={`w-full h-[300px] bg-slate-50 rounded-none flex flex-col items-center justify-center px-6 pt-6 pb-12 relative overflow-hidden transition-all duration-500 ease-out border border-slate-100 ${index === activeIndex ? 'cursor-pointer shadow-xl ring-2 ring-indigo-500 shadow-indigo-100' : 'cursor-default opacity-50 grayscale'}`}>
                       
                        <img
                          src={type.imageUrl || fallbackImage}
                          alt={type.name}
                          className={`w-full h-[200px] object-contain drop-shadow-xl transition-all duration-700 z-10 ${index === activeIndex ? 'scale-110' : 'scale-90'}`}
                        />
                        {/* Label inside card but below image */}
                        <div className="mt-4 text-center w-full">
                          <h3 className={`text-2xl font-black text-slate-800 tracking-tight ${isMyanmar ? 'font-myanmar' : ''}`}>{type.name}</h3>
                          <div className={`h-1.5 w-12 bg-indigo-600 mt-3 rounded-none mx-auto transition-all duration-500 ${index === activeIndex ? 'w-20' : 'w-4 opacity-0'}`} />
                        </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="relative w-full max-w-5xl mx-auto flex justify-between items-center px-4">
                  <button 
                    onClick={handlePrev}
                    className="w-14 h-14 rounded-none border border-slate-200 transition-all duration-300 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 bg-white shadow-xl z-30"
                    aria-label="Previous build type"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="w-14 h-14 rounded-none border border-slate-200 transition-all duration-300 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-700 bg-white shadow-xl z-30"
                    aria-label="Next build type"
                  >
                    <ChevronRight size={24} />
                  </button>
              </div>
            </div>
          )}

          {/* Loading/Error fallbacks inside the card */}
          {isLoading && (
            <div className="h-80 flex items-center justify-center z-10">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
          {isError && (
            <div className="h-80 flex items-center justify-center text-red-500 font-bold z-10">
              Failed to load body types. Please try again.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BrowseCarByBuildTypes;
