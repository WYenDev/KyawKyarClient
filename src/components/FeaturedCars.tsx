import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// replaced CarCard with a lightweight FeaturedCard for featured list
import FeaturedCard from './FeaturedCard';
import { useGetApiCarsFeatured } from '../services/api';
import type { CarListItem } from '../services/api';

const SCROLL_AMOUNT = 320;

const FeaturedCars: React.FC = () => {
  const { data, isLoading, isError } = useGetApiCarsFeatured();
  const cars: CarListItem[] = data ?? [];

  // limit to first 6 for the horizontal teaser
  const displayCars = cars.length > 0 ? cars.slice(0, 6) : [];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const evaluateScroll = () => {
    const el = containerRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
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
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <div className="inline-flex items-center gap-3 mb-2">
              <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold">Featured</span>
              <span className="text-sm text-slate-500">Handpicked premium vehicles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">Featured Cars</h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">Premium picks from our latest inventory — quality checked and ready.</p>
          </div>

          <div>
            <button className="inline-flex items-center gap-2 border border-indigo-600 text-indigo-600 bg-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-50 transition">View All Cars</button>
          </div>
        </div>

        {isLoading ? (
          <div className="relative -mx-4 px-4">
            <div className="flex gap-6 w-max py-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-64 sm:w-72 md:w-80 lg:w-96 h-64 flex-shrink-0 rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="text-center py-12 text-red-600">Failed to load featured cars.</div>
        ) : (
          <div className="relative -mx-4 px-4">
            {/* left fade */}
            <div aria-hidden className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/100 to-white/0 hidden sm:block" />
            {/* right fade */}
            <div aria-hidden className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/100 to-white/0 hidden sm:block" />

            <div
              ref={containerRef}
              className="flex gap-6 py-2 overflow-x-auto scrollbar-hidden no-scrollbar scroll-smooth snap-x snap-mandatory pb-6"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {displayCars.map((car) => (
                <div key={car.id} className="snap-start w-64 sm:w-72 md:w-80 lg:w-96 flex-shrink-0">
                  <FeaturedCard car={car} />
                </div>
              ))}
            </div>

            {/* left / right arrow controls */}
            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20">
              <button
                type="button"
                onClick={() => scrollBy(-SCROLL_AMOUNT)}
                aria-label="Scroll left"
                className={`hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow transition ${
                  canScrollLeft ? 'opacity-100' : 'opacity-40 pointer-events-none'
                }`}
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20">
              <button
                type="button"
                onClick={() => scrollBy(SCROLL_AMOUNT)}
                aria-label="Scroll right"
                className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 shadow transition ${
                  canScrollRight ? 'opacity-100 hover:bg-indigo-700' : 'opacity-40 pointer-events-none bg-white/90'
                }`}
              >
                <ChevronRight className={`w-5 h-5 ${canScrollRight ? 'text-white' : 'text-slate-700'}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCars;
