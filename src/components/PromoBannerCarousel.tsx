import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetApiPromoBannersActive } from '../services/api';

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

const PromoBannerCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { data: banners, isLoading } = useGetApiPromoBannersActive();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const safeBanners = Array.isArray(banners) ? banners.filter((b) => b.imageUrl) : [];
  const total = safeBanners.length;

  // Auto-slide
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused && total > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, AUTO_SLIDE_INTERVAL);
    }
  }, [isPaused, total]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  // Keep current in bounds
  useEffect(() => {
    if (current >= total && total > 0) setCurrent(0);
  }, [total, current]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    resetTimer();
  };

  const prev = () => goTo((current - 1 + total) % total);
  const next = () => goTo((current + 1) % total);

  const handleClick = (banner: (typeof safeBanners)[0]) => {
    // If banner has a landing page (slug), go there first; otherwise go straight to destination
    if (banner.slug) {
      navigate(`/promo/${banner.slug}`);
      return;
    }
    if (banner.type === 'NEW_ARRIVAL' && banner.brandName) {
      navigate(`/buyCars?brand=${encodeURIComponent(banner.brandName)}`);
    } else if (banner.type === 'PROMOTION' && banner.linkUrl) {
      if (banner.linkUrl.startsWith('http')) {
        window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        navigate(banner.linkUrl);
      }
    }
  };

  if (isLoading || safeBanners.length === 0) return null;

  return (
    <section className="relative w-full bg-[#f8fafc]">
      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3 py-3 sm:py-4">
        <div
          className="relative overflow-hidden rounded-none shadow-lg border border-white/50 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Slides container */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {safeBanners.map((banner) => (
              <div
                key={banner.id}
                className="w-full flex-shrink-0 relative cursor-pointer"
                onClick={() => handleClick(banner)}
              >
                <div className="relative w-full aspect-[21/7] sm:aspect-[21/6] overflow-hidden">
                  <img
                    src={banner.imageUrl!}
                    alt={banner.title || 'Promotional banner'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span
                      className={`
                        inline-flex items-center px-2.5 py-1 rounded-none text-[10px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-sm
                        ${banner.type === 'NEW_ARRIVAL'
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-indigo-600/90 text-white'
                        }
                      `}
                    >
                      {banner.type === 'NEW_ARRIVAL' ? 'New Arrival' : 'Promotion'}
                    </span>
                  </div>

                  {/* Title overlay */}
                  {banner.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                      <h3 className="text-white text-sm sm:text-lg md:text-xl font-black drop-shadow-lg line-clamp-2">
                        {banner.title}
                      </h3>
                      {banner.type === 'NEW_ARRIVAL' && banner.brandName && (
                        <p className="text-white/80 text-xs sm:text-sm font-semibold mt-0.5 drop-shadow-md">
                          Browse {banner.brandName} new arrivals →
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation arrows — visible on hover when multiple slides */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}

          {/* Dots indicator */}
          {total > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
              {safeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); goTo(idx); }}
                  className={`
                    rounded-full transition-all duration-300
                    ${idx === current
                      ? 'w-6 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                    }
                  `}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoBannerCarousel;
