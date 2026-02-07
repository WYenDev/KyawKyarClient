import React from 'react';
import { useGetApiBrands } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BrowseCarByBrands: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const isMyanmar = i18n?.language?.startsWith('mm');
  const { data: brandData, isLoading, isError } = useGetApiBrands({ limit: 100 });
  const navigate = useNavigate();

  const brands = brandData?.items ?? [];

  const handleBrandClick = (brandName: string) => {
    navigate(`/buyCars?brand=${encodeURIComponent(brandName)}`);
  };

  const fallbackLogo = 'https://storage.googleapis.com/kyaw-kyar.appspot.com/brands/default-brand.png';

  return (
    <section className="py-2 lg:py-3 relative overflow-hidden bg-transparent">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-blue-50/30 blur-[100px] -z-10" />

      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3">
        <div className="bg-white rounded-none p-3 sm:p-6 lg:p-8 shadow-2xl shadow-slate-200/40 border border-white relative overflow-hidden">
          {/* Section Header */}
          <div className="mb-5 relative z-10">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-amber-50 text-amber-800 text-[10px] font-black uppercase tracking-[0.2em]">
                 <Shield className="w-3 h-3 fill-amber-800" />
                 Trusted Manufacturers
              </div>
              <h2 className={`text-3xl lg:text-5xl font-black text-slate-900 tracking-tight ${isMyanmar ? 'font-myanmar text-[1.6rem] lg:text-[2.4rem] max-sm:text-[1.85rem] leading-[1.6]' : 'leading-[1.4]'}`}>
                {isMyanmar ? (
                  <>
                    <span className="inline-block pt-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      {t('browse_by_brand.highlightedText')}
                    </span>{" "}
                    {t('browse_by_brand.title')}
                  </>
                ) : (
                  <>
                    {t('browse_by_brand.title')}{" "}
                    <span className="inline-block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      {t('browse_by_brand.highlightedText')}
                    </span>
                  </>
                )}
              </h2>
              <p className={`mt-3 text-slate-500 max-w-2xl text-lg leading-relaxed ${isMyanmar ? 'font-myanmar pt-1' : ''}`}>
                We partner with the world's leading car manufacturers to bring you a diverse selection of quality vehicles.
              </p>
            </div>
          </div>

          {/* Logo Marquee */}
          {!isLoading && !isError && brands.length > 0 && (
            <div className="relative overflow-hidden z-10">
              <style>
                {`
                  @keyframes brand-marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                `}
              </style>
              <div
                className="flex gap-8 items-center py-6"
                style={{
                  width: '200%',
                  animation: 'brand-marquee 30s linear infinite',
                }}
              >
                {[...brands, ...brands].map((brand, idx) => (
                  <button
                    type="button"
                    key={`${brand.id}-${idx}`}
                    onClick={() => handleBrandClick(brand.name)}
                    className="shrink-0 flex items-center justify-center bg-slate-50 hover:bg-white rounded-3xl px-10 py-8 border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-xl transition-all transform hover:-translate-y-2 group/logo"
                    title={brand.name}
                  >
                    <img
                      src={(brand as unknown as { imageUrl?: string | null }).imageUrl || fallbackLogo}
                      alt={`${brand.name} logo`}
                      className="h-10 sm:h-14 w-auto object-contain transition-transform duration-500 group-hover/logo:scale-110"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading/Error fallbacks inside the card */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 z-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-28 bg-slate-50 rounded-2xl animate-pulse" />
              ))}
            </div>
          )}
          {isError && (
            <div className="text-center py-12 text-red-500 font-bold z-10">
              Failed to load brands. Please try again later.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BrowseCarByBrands;
