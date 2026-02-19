import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetApiPromoBannersActive } from '../services/api';
import type { GetApiPromoBannersActive200Item } from '../services/api';

export type PromoBannerItem = GetApiPromoBannersActive200Item & { slug?: string; modelName?: string; brandName?: string };

const handleClick = (banner: PromoBannerItem, navigate: ReturnType<typeof useNavigate>) => {
  if (banner.slug) {
    navigate(`/promo/${banner.slug}`);
    return;
  }
  if (banner.type === 'NEW_ARRIVAL') {
    const modelName = (banner as PromoBannerItem).modelName;
    const brandName = (banner as PromoBannerItem).brandName ?? banner.brandName;
    if (modelName) {
      navigate(`/buyCars?model=${encodeURIComponent(modelName)}`);
    } else if (brandName) {
      navigate(`/buyCars?brand=${encodeURIComponent(brandName)}`);
    }
  } else if (banner.type === 'PROMOTION' && banner.linkUrl) {
    if (banner.linkUrl.startsWith('http')) {
      window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(banner.linkUrl);
    }
  }
};

/** Presentational grid of promo banners; use when you already have a filtered list. */
export const PromoBannerGrid: React.FC<{ banners: PromoBannerItem[] }> = ({ banners }) => {
  const navigate = useNavigate();
  if (banners.length === 0) return null;
  return (
    <section className="relative w-full bg-[#f8fafc]">
      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3 py-3 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative overflow-hidden rounded-none shadow-lg border border-white/50 cursor-pointer group"
              onClick={() => handleClick(banner, navigate)}
            >
              <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] overflow-hidden">
                <img
                  src={banner.imageUrl!}
                  alt={banner.title || 'Promotional banner'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                {banner.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                    <h3 className="text-white text-sm sm:text-lg md:text-xl font-black drop-shadow-lg line-clamp-2">
                      {banner.title}
                    </h3>
                    {banner.type === 'NEW_ARRIVAL' && ((banner as PromoBannerItem).modelName || (banner as PromoBannerItem).brandName || banner.brandName) && (
                      <p className="text-white/80 text-xs sm:text-sm font-semibold mt-0.5 drop-shadow-md">
                        Browse {(banner as PromoBannerItem).modelName || (banner as PromoBannerItem).brandName || banner.brandName} new arrivals →
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PromoBannerCarousel: React.FC = () => {
  const { data: banners, isLoading } = useGetApiPromoBannersActive();
  const safeBanners = Array.isArray(banners) ? banners.filter((b): b is PromoBannerItem => Boolean(b.imageUrl)) : [];

  if (isLoading || safeBanners.length === 0) return null;
  return <PromoBannerGrid banners={safeBanners} />;
};

export default PromoBannerCarousel;
