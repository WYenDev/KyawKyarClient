import React, { useRef, useState, useEffect } from 'react';
import { useGetApiBuildTypes } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

const BrowseCarByBuildTypes: React.FC = () => {
  const { data: buildTypes = [], isLoading, isError } = useGetApiBuildTypes();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fallback image source if API doesn't provide one
  const fallbackImage = 'https://images.unsplash.com/photo-1494905998402-395d579af36f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';

  // Check scroll position to toggle navigation arrows
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [buildTypes]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  const handleBuildTypeClick = (buildTypeName: string) => {
    // Navigate to BuyCars page with buildType filter
    navigate(`/buyCars?buildType=${encodeURIComponent(buildTypeName)}`);
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-50 relative overflow-hidden">
        {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-50/50 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-50/30 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
               <LayoutGrid className="w-3 h-3 fill-indigo-700" />
               Vehicle Categories
             </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Browse by <span className="text-indigo-600">Body Type</span>
            </h2>
            <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
              Find the perfect match for your lifestyle. Select a body style to see what's available.
            </p>
          </div>
          
          {/* External Navigation Controls */}
           <div className="hidden md:flex gap-3 pb-2">
             <button 
               onClick={() => scroll('left')}
               disabled={!canScrollLeft}
               className={`w-12 h-12 rounded-full border border-slate-200 transition-all duration-300 flex items-center justify-center
                 ${!canScrollLeft 
                   ? 'opacity-40 cursor-not-allowed text-slate-400' 
                   : 'hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-700 bg-white shadow-lg shadow-indigo-100'}`}
               aria-label="Scroll left"
             >
               <ChevronLeft size={24} />
             </button>
             <button 
               onClick={() => scroll('right')}
               disabled={!canScrollRight}
               className={`w-12 h-12 rounded-full border border-slate-200 transition-all duration-300 flex items-center justify-center
                 ${!canScrollRight 
                   ? 'opacity-40 cursor-not-allowed text-slate-400' 
                   : 'hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-700 bg-white shadow-lg shadow-indigo-100'}`}
               aria-label="Scroll right"
             >
               <ChevronRight size={24} />
             </button>
           </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="h-64 flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="h-64 flex items-center justify-center text-red-500">
            Failed to load body types. Please try again.
          </div>
        )}

        {/* Slider Content */}
        {!isLoading && !isError && (
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex gap-5 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none' 
            }}
          >
            {buildTypes.map((type) => (
              <div 
                key={type.id}
                onClick={() => handleBuildTypeClick(type.name)}
                className="flex-shrink-0 w-[240px] snap-center group cursor-pointer flex flex-col items-center text-center gap-4 transition-all duration-300"
              >
                 {/* Circle Image Wrapper with minimal hover effect */}
                <div className="w-[220px] h-[220px] rounded-full bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-indigo-100/50 transition-all duration-500 ease-out border border-transparent group-hover:border-slate-50">
                   
                   {/* Subtle Background Blob */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   
                   <img
                      src={type.imageUrl || fallbackImage}
                      alt={type.name}
                      className="w-full h-full object-contain drop-shadow-sm group-hover:drop-shadow-lg group-hover:scale-110 transition-all duration-500 z-10"
                    />
                </div>
                
                {/* Floating Label */}
                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold text-slate-700 group-hover:text-indigo-600 transition-colors duration-300">
                      {type.name}
                    </h3>
                    <div className="h-0.5 w-0 bg-indigo-600 mt-2 group-hover:w-12 transition-all duration-300 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </section>
  );
};

export default BrowseCarByBuildTypes;
