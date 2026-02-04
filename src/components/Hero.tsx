import React, { useEffect, useState, useMemo } from 'react';
import { Search, ShieldCheck, Star, Users, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetApiCarsFilters, useGetApiHome } from '../services/api';
import { brands as localBrands, brandModels as localBrandModels } from '../data/cars';
import CarImage from '../assets/cars.jpg';

const Hero: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const isMyanmar = i18n?.language?.startsWith('mm');
  const navigate = useNavigate();
  const { data: homeData } = useGetApiHome();
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');

  const { data: filterData } = useGetApiCarsFilters();
  const serverBrands = filterData?.brandsWithModels ? Object.keys(filterData.brandsWithModels) : undefined;
  const serverBrandModels = filterData?.brandsWithModels ?? undefined;
  const brandsToShow = serverBrands && serverBrands.length > 0 ? serverBrands : localBrands;

  const normalizeModelsForBrand = (brandKey?: string) => {
    if (!brandKey) return [] as { id: string; name: string; carCount?: number }[];
    
    // Check if we have server data for this brand
    if (serverBrandModels && serverBrandModels[brandKey]) {
      const models = serverBrandModels[brandKey].models || [];
      return models.map(m => ({
        id: m.id ?? m.name ?? String(m),
        name: m.name ?? m.id ?? String(m),
        carCount: m.carCount
      }));
    }

    const raw = localBrandModels[brandKey] ?? [];
    if (raw.length === 0) return [] as { id: string; name: string; carCount?: number }[];
    
    if (typeof raw[0] === 'string') {
      return (raw as string[]).map(name => ({ id: name, name, carCount: undefined }));
    }
    // Fallback if local data somehow has objects (unlikely based on types but keeping logical structure)
    return (raw as { id?: string; name?: string }[]).map(m => ({ 
      id: m.id ?? m.name ?? String(m), 
      name: m.name ?? m.id ?? String(m),
      carCount: undefined 
    }));
  };

  const availableModels = useMemo(() => normalizeModelsForBrand(brand), [brand, serverBrandModels]);

  const navigateWithParams = (b?: string, m?: string) => {
    const params: string[] = [];
    if (b) params.push(`brand=${encodeURIComponent(b)}`);
    if (m) params.push(`model=${encodeURIComponent(m)}`);
    const q = params.length ? `?${params.join('&')}` : '';
    navigate(`/buyCars${q}`);
  };

  useEffect(() => {
    if (model) {
      const found = availableModels.some(m => m.id === model || m.name === model);
      if (!found) setModel('');
    }
  }, [brand, availableModels]);

  return (
    <section className="relative xl:min-h-screen flex xl:items-center bg-white overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-14 md:pt-32 md:pb-16 xl:py-0">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-15%] left-[-15%] w-[80%] h-[70%] rounded-full bg-indigo-50/50 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[60%] rounded-full bg-blue-50/40 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-16 items-center">

          {/* LEFT SIDE: Content */}
          <div className="xl:col-span-6 space-y-5 sm:space-y-8 text-center xl:text-left order-2 xl:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white border border-slate-200/80 px-4 py-2 rounded-full shadow-sm">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-900 text-[11px] font-bold tracking-widest uppercase">
                  Kyaw Kyar Premium Showroom
                </span>
              </div>

              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight md:leading-snug py-1 sm:py-3 ${isMyanmar ? 'font-myanmar' : ''}`}>
                <span className="inline-block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {t('hero.title_prefix')}
                </span>
                <span className="block mb-2">
                  {t('hero.title_suffix')}
                </span>
              </h1>
              <p className={`text-base sm:text-lg text-slate-600 max-w-lg mx-auto xl:mx-0 leading-relaxed ${isMyanmar ? 'font-myanmar' : ''}`}>
                {t('hero.description')}
              </p>
            </div>

            {/* INTEGRATED SEARCH */}
            <div className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl xl:flex-row max-w-2xl shadow-lg mx-auto xl:mx-0">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-white border-slate-300 rounded-lg px-4 py-2.5 sm:px-5 sm:py-3.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700 text-sm sm:text-base"
              >
                <option value="">All Brands</option>
                {brandsToShow.map((b) => {
                  const count = serverBrandModels?.[b]?.totalCars;
                  return (
                    <option key={b} value={b}>
                      {b}{count !== undefined ? ` (${count})` : ''}
                    </option>
                  );
                })}
              </select>

              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!brand}
                className={`w-full border-slate-300 rounded-lg px-4 py-2.5 sm:px-5 sm:py-3.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm sm:text-base ${!brand ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}
              >
                <option value="">All Models</option>
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}{m.carCount !== undefined ? ` (${m.carCount})` : ''}
                  </option>
                ))}
              </select>

              <button
                onClick={() => navigateWithParams(brand || undefined, model || undefined)}
                className="w-full xl:w-auto bg-slate-900 text-white px-8 py-2.5 sm:py-3.5 rounded-lg font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Search</span>
              </button>
            </div>

            {/* Trust & Info Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200/80 max-w-md mx-auto xl:mx-0">
              <div className="flex flex-col items-center xl:items-start">
                <div className="flex items-center text-amber-500 mb-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold text-slate-900 ml-1">4.9/5</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Customer Rating</span>
              </div>
              <div className="flex flex-col items-center xl:items-start">
                <Users className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">15k+ Happy Owners</span>
              </div>
              <div className="flex flex-col items-center xl:items-start">
                <MapPin className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{filterData?.showrooms?.length} branches</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Visual Content */}
          <div className="xl:col-span-6 relative order-1 xl:order-2">
            <div className="relative h-[200px] sm:h-[280px] md:h-[320px] xl:h-[480px] w-full mt-2 xl:mt-0">
              <div className="absolute inset-0 rounded-3xl xl:rounded-4xl overflow-hidden shadow-2xl border-8 xl:border-12 border-white group">
                <img
                  src={homeData?.image?.url || CarImage}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                  alt="Kyaw Kyar Luxury SUV"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-4 -right-2 sm:-bottom-8 sm:-right-4 xl:bottom-8 xl:-left-16 z-20">
                <div className="bg-white/80 backdrop-blur-xl border border-white p-3 sm:p-5 xl:p-7 rounded-2xl xl:rounded-3xl shadow-xl animate-float">
                  <div className="text-center">
                    <p className="text-xs xl:text-sm text-indigo-600 font-bold uppercase tracking-widest mb-1">
                      Monthly From
                    </p>
                    <div className="text-lg sm:text-xl xl:text-3xl font-black text-slate-900 flex items-baseline justify-center gap-1.5">
                      300K <span className="text-slate-500 font-medium text-xs xl:text-base">to</span> 2M
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;


