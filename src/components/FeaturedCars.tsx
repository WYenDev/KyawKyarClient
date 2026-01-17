import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Star, Plus } from 'lucide-react';
import FeaturedCard from './FeaturedCard';
import { useGetApiCarsFeatured } from '../services/api';
import type { CarListItem } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SCROLL_AMOUNT = 300; // reduced to match smaller card widths

const FeaturedCars: React.FC = () => {
  const { data, isLoading, isError } = useGetApiCarsFeatured();
  const cars: CarListItem[] = data ?? [];
  const navigate = useNavigate();

  const displayCars = cars.length > 0 ? cars.slice(0, 6) : [];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const evaluateScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    evaluateScroll();
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => evaluateScroll();
    const ro = new ResizeObserver(evaluateScroll);
    el.addEventListener('scroll', onScroll, { passive: true });
    ro.observe(el);
    window.addEventListener('resize', evaluateScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
      window.removeEventListener('resize', evaluateScroll);
    };
  }, [displayCars.length]);

  const scrollBy = (amount: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    // Updated background to match Hero's clean white/slate-50 transition
    <section id="featured" className="py-4 lg:py-12 bg-white relative overflow-hidden">
      {/* Background Glow - Same Mesh style as Hero */}
      <div className="absolute top-0 right-0 w-[30%] h-[30%] bg-indigo-50/50 blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Unified with Hero's Bold Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6">
          <div className="space-y-4">
            {/* Color Swapped from Amber to Indigo */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Star className="w-3 h-3 fill-indigo-700" />
              Featured Showroom
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Top Tier <span className="text-indigo-600">Selection</span>
            </h2>
            <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
              Carefully inspected vehicles ranging from city commuters to luxury SUVs. 
              Quality guaranteed for the Myanmar roads.
            </p>
          </div>

          <button
            onClick={() => navigate('/buyCars')}
            className="group inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100"
          >
            Explore Full Inventory
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[300px] lg:w-[360px] h-[420px] flex-shrink-0 rounded-[2rem] bg-slate-50 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500">Failed to load featured cars. Please try again later.</p>
          </div>
        ) : (
          <div className="relative group/container">
            {/* Navigation Arrows - Improved sizing and Indigo coloring */}
            <div className="absolute top-1/2 -left-6 z-30 -translate-y-1/2">
              <button
                onClick={() => scrollBy(-SCROLL_AMOUNT)}
                className={`w-12 h-12 rounded-full bg-white shadow-2xl border border-slate-100 flex items-center justify-center transition-all ${
                  canScrollLeft ? 'opacity-100 scale-100 hover:text-indigo-600' : 'opacity-0 scale-90 pointer-events-none'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute top-1/2 -right-6 z-30 -translate-y-1/2">
              <button
                onClick={() => scrollBy(SCROLL_AMOUNT)}
                className={`w-12 h-12 rounded-full bg-indigo-600 text-white shadow-2xl flex items-center justify-center transition-all hover:bg-slate-900 ${
                  canScrollRight ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* The Scroll Container - Added padding to prevent shadow clipping */}
            <div
              ref={containerRef}
              className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-10 pt-4 px-2"
            >
              {displayCars.map((car) => (
                <div key={car.id} className="snap-start w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0">
                  <FeaturedCard car={car} />
                </div>
              ))}

              {/* "View More" Card - Re-styled for the Indigo theme */}
              <div 
                onClick={() => navigate('/buyCars')}
                className="snap-start flex-shrink-0 w-64 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group/more"
              >
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover/more:scale-110 group-hover/more:text-indigo-600 transition-all">
                  <Plus className="w-6 h-6 text-slate-400 group-hover/more:text-indigo-600" />
                </div>
                <span className="font-bold text-slate-900">Discover More</span>
                <span className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-medium">150+ Vehicles</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;
