import React, { useRef, useState, useEffect } from 'react';
import { useGetApiBuildTypes } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <section className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-100/40 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-100/40 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Browse by <span className="text-indigo-600">Build Type</span>
            </h2>
            <p className="mt-3 text-slate-600 text-lg max-w-2xl">
              Find the perfect match for your lifestyle. Select a body style to see what's available.
            </p>
          </div>
          
          {/* External Navigation Controls */}
           <div className="hidden md:flex gap-3">
             <button 
               onClick={() => scroll('left')}
               disabled={!canScrollLeft}
               className={`p-3 rounded-full border border-slate-200 transition-all duration-300 flex items-center justify-center
                 ${!canScrollLeft 
                   ? 'opacity-40 cursor-not-allowed text-slate-400' 
                   : 'hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-700 bg-white shadow-sm'}`}
               aria-label="Scroll left"
             >
               <ChevronLeft size={20} />
             </button>
             <button 
               onClick={() => scroll('right')}
               disabled={!canScrollRight}
               className={`p-3 rounded-full border border-slate-200 transition-all duration-300 flex items-center justify-center
                 ${!canScrollRight 
                   ? 'opacity-40 cursor-not-allowed text-slate-400' 
                   : 'hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-700 bg-white shadow-sm'}`}
               aria-label="Scroll right"
             >
               <ChevronRight size={20} />
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
                className="flex-shrink-0 w-[240px] sm:w-[280px] snap-center group cursor-pointer"
              >
                <div className="relative h-[320px] rounded-3xl overflow-hidden bg-white shadow-md group-hover:shadow-xl transition-all duration-300 border border-slate-100">
                  {/* Image Background */}
                  <div className="absolute inset-0 bg-slate-200">
                    <img
                      src={type.imageUrl || fallbackImage}
                      alt={type.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                  </div>
                  
                  {/* Content Content - Centered Style like Modern Show Pages */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                    <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
                        {type.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-indigo-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <span className="text-sm font-semibold uppercase tracking-wider">Browse Cars</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Border on Hover */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-indigo-500/50 rounded-3xl transition-colors duration-300 pointer-events-none" />
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
