import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Plus, LucideProps } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FeaturedCard from './FeaturedCard';
import type { CarListItem } from '../services/api';
import { useTranslation } from 'react-i18next';

const SCROLL_AMOUNT = 300;

interface CarCarouselProps {
  id: string;
  badgeText: string;
  bg: string;
  badgeIcon: React.ReactElement<LucideProps>;
  title: string;
  highlightedTitle: string;
  description: string;
  useDataHook: () => { data: any; isLoading: boolean; isError: boolean };
  theme: 'indigo' | 'amber';
}

const themeClasses = {
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    fill: 'fill-indigo-700',
    hoverBg: 'hover:bg-indigo-600',
    shadow: 'shadow-indigo-100',
    highlight: 'text-indigo-600',
    buttonBg: 'bg-indigo-600',
    hoverBorder: 'hover:border-indigo-300',
    hoverBgLight: 'hover:bg-indigo-50/30',
    hoverText: 'hover:text-indigo-600',
    gradientFrom: 'from-indigo-600',
    gradientTo: 'to-purple-600',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    fill: 'fill-amber-700',
    hoverBg: 'hover:bg-amber-600',
    shadow: 'shadow-amber-100',
    highlight: 'text-amber-600',
    buttonBg: 'bg-amber-600',
    hoverBorder: 'hover:border-amber-300',
    hoverBgLight: 'hover:bg-amber-50/30',
    hoverText: 'hover:text-amber-600',
    gradientFrom: 'from-amber-600',
    gradientTo: 'to-orange-600',
  },
};

const CarCarousel: React.FC<CarCarouselProps> = ({ id,bg, badgeText, badgeIcon, title, highlightedTitle, description, useDataHook, theme }) => {
  const { t, i18n } = useTranslation('home');
  const isMyanmar = i18n?.language?.startsWith('mm');
  const { data, isLoading, isError } = useDataHook();
  const cars: CarListItem[] = (data as any)?.items ?? (data as CarListItem[]) ?? [];
  const navigate = useNavigate();
  const classes = themeClasses[theme];

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
    <section id={id} className={`py-2 lg:py-3 relative overflow-hidden bg-transparent`}>
      <div className={`absolute top-0 right-0 w-[40%] h-[40%] ${theme === 'indigo' ? 'bg-indigo-100/30' : 'bg-amber-100/30'} blur-[120px] -z-10`} />

      <div className="max-w-[1600px] mx-auto px-1 sm:px-2 lg:px-3">
        <div className="bg-white rounded-none p-3 sm:p-6 lg:p-8 shadow-2xl shadow-slate-200/40 border border-white relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4 relative z-10">
            <div className="space-y-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${classes.bg} ${classes.text} text-[10px] font-black uppercase tracking-[0.2em]`}>
                {React.cloneElement(badgeIcon, { className: `w-3 h-3 ${classes.fill}` })}
                {badgeText}
              </div>
              <h2 className={`text-3xl lg:text-5xl font-black text-slate-900 tracking-tight ${isMyanmar ? 'font-myanmar text-[1.6rem] lg:text-[2.4rem] max-sm:text-[1.85rem] leading-[1.6]' : 'leading-[1.4]'}`}>
                {isMyanmar ? (
                  <>
                    <span className={`inline-block pt-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r ${classes.gradientFrom} ${classes.gradientTo}`}>
                      {highlightedTitle}
                    </span>{" "}
                    {title}
                  </>
                ) : (
                  <>
                    {title}{" "}
                    <span className={`inline-block py-2 text-transparent bg-clip-text bg-gradient-to-r ${classes.gradientFrom} ${classes.gradientTo}`}>
                      {highlightedTitle}
                    </span>
                  </>
                )}
              </h2>
              <p className={`text-slate-500 max-w-xl text-lg leading-relaxed ${isMyanmar ? 'font-myanmar pt-1' : ''}`}>
                {description}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex gap-6 overflow-hidden relative z-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-[300px] lg:w-[360px] h-[420px] flex-shrink-0 rounded-none bg-slate-50 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-20 bg-slate-50 rounded-none border-2 border-dashed border-slate-200 relative z-10">
              <p className="text-slate-500 font-bold font-myanmar">တောင်းပန်ပါသည်။ ရှာမတွေ့ပါ။</p>
            </div>
          ) : (
            <>
              <div className="relative group/container z-10">
                <div className="absolute top-1/2 -left-4 z-30 -translate-y-1/2 hidden xl:block">
                  <button
                    onClick={() => scrollBy(-SCROLL_AMOUNT)}
                    className={`w-14 h-14 rounded-none bg-white shadow-2xl border border-slate-100 flex items-center justify-center transition-all ${
                      canScrollLeft ? `opacity-100 scale-100 ${classes.hoverText}` : 'opacity-0 scale-90 pointer-events-none'
                    }`}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                </div>

                <div className="absolute top-1/2 -right-4 z-30 -translate-y-1/2 hidden xl:block">
                  <button
                    onClick={() => scrollBy(SCROLL_AMOUNT)}
                    className={`w-14 h-14 rounded-none ${classes.buttonBg} text-white shadow-2xl flex items-center justify-center transition-all hover:bg-slate-900 ${
                      canScrollRight ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                    }`}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                <div
                  ref={containerRef}
                  className="flex gap-6 sm:gap-8 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-10 pt-4 px-1"
                >
                  {displayCars.map((car) => (
                    <div key={car.id} className="snap-start w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0 transition-transform duration-500 hover:z-20">
                      <FeaturedCard car={car} />
                    </div>
                  ))}

                  <div
                    onClick={() => navigate('/buyCars')}
                    className={`snap-start flex-shrink-0 w-64 flex flex-col items-center justify-center bg-slate-50/50 rounded-none border-2 border-dashed border-slate-200 ${classes.hoverBorder} ${classes.hoverBgLight} transition-all cursor-pointer group/more`}
                  >
                    <div className={`w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover/more:scale-110 transition-all`}>
                      <Plus className={`w-7 h-7 text-slate-400 ${classes.hoverText} transition-colors`} />
                    </div>
                    <span className="font-bold text-slate-900">Discover More</span>
                    <span className="text-[10px] text-slate-400 mt-2 uppercase tracking-[0.2em] font-black">150+ Vehicles</span>
                  </div>
                </div>
              </div>
              <div className="text-center mt-8 relative z-10">
                <button
                  onClick={() => navigate('/buyCars')}
                  className={`group inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-2xl text-base font-bold hover:bg-indigo-600 transition-all shadow-xl hover:shadow-2xl shadow-slate-900/10 transform hover:-translate-y-1`}
                >
                  Explore Full Inventory
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CarCarousel;
