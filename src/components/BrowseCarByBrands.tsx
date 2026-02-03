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
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
               <Shield className="w-3 h-3 fill-amber-800" />
               Trusted Manufacturers
            </div>
            <h2 className={`text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight ${isMyanmar ? 'font-myanmar' : ''}`}>

              <span className={`${isMyanmar ? 'font-myanmar text-indigo-600' : ""}`}>{t('browse_by_brand.title')}</span> <span className={`${isMyanmar ? 'font-myanmar' : "text-indigo-600"}`}>{t('browse_by_brand.highlightedText')}</span>
            </h2>
            <p className={`mt-4 text-slate-500 max-w-2xl text-lg leading-relaxed ${isMyanmar ? 'font-myanmar' : ''}`}>
              We partner with the world's leading car manufacturers to bring you a diverse selection of quality vehicles.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-12 text-red-500">
            Failed to load brands. Please try again later.
          </div>
        )}

        {/* Logo Marquee */}
        {!isLoading && !isError && brands.length > 0 && (
          <div className="relative overflow-hidden">
            <style>
              {`
                @keyframes brand-marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `}
            </style>
            <div
              className="flex gap-8 items-center py-4"
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
                  className="shrink-0 flex items-center justify-center bg-slate-50 hover:bg-white rounded-2xl px-6 py-4 border border-slate-100 hover:border-white shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                  title={brand.name}
                >
                  <img
                    src={(brand as unknown as { imageUrl?: string | null }).imageUrl || fallbackLogo}
                    alt={`${brand.name} logo`}
                    className="h-12 w-auto object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseCarByBrands;
