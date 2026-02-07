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
    <section className="relative flex xl:items-center bg-[#f8fafc] overflow-hidden pt-[5.5rem] pb-2 sm:pt-24 sm:pb-3 md:pt-26 md:pb-4 xl:pt-[5.5rem] xl:pb-3">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-15%] left-[-15%] w-[80%] h-[70%] rounded-full bg-indigo-50/50 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[60%] rounded-full bg-blue-50/40 blur-[120px]" />
      </div>

      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3 w-full z-10">
        <div className="bg-white rounded-none p-3 sm:p-7 xl:p-10 border border-white shadow-2xl shadow-indigo-100/20 relative overflow-hidden group/hero">
          {/* Subtle decorative element inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-none -mr-32 -mt-32 opacity-50 transition-transform duration-1000 group-hover/hero:scale-110" />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-16 items-center relative z-10">

            {/* LEFT SIDE: Content */}
            <div className="xl:col-span-6 space-y-4 sm:space-y-6 text-center xl:text-left order-2 xl:order-1 pt-2 xl:pt-0">
              <div className="xl:hidden w-full px-2 mb-2">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-none shadow-lg shadow-indigo-100/40 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-white border-slate-200 rounded-none px-3 py-3 text-slate-700 text-[15px] font-black focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Brand</option>
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
                      className={`w-full border-slate-200 rounded-none px-3 py-3 text-[15px] font-black focus:ring-2 focus:ring-indigo-500 ${!brand ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}
                    >
                      <option value="">Model</option>
                      {availableModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}{m.carCount !== undefined ? ` (${m.carCount})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => navigateWithParams(brand || undefined, model || undefined)}
                    className="w-full bg-slate-900 text-white py-3.5 rounded-none font-black hover:bg-indigo-600 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group text-[15px]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Cars</span>
                  </button>
                </div>
              </div>

              <p className={`xl:hidden text-base text-slate-500 text-left leading-relaxed ${isMyanmar ? 'font-myanmar leading-relaxed px-4 mb-2' : ''}`}>
                {t('hero.description')}
              </p>
              <div className="space-y-4 sm:space-y-6">
                <div className="hidden xl:inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-none shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span className="text-indigo-900 text-[11px] font-black tracking-widest uppercase">
                    Kyaw Kyar Premium Showroom
                  </span>
                </div>

                <div className="xl:block hidden">
                  <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight md:leading-snug sm:py-2 ${isMyanmar ? 'font-myanmar sm:leading-[1.4] md:leading-[1.5] lg:leading-[1.6]' : ''}`}>
                    <span className={`inline-block py-1 sm:py-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900 ${isMyanmar ? 'lg:mt-6 lg:mb-2' : ''}`}>
                      {t('hero.title_prefix')}
                    </span>
                    <span className={`block sm:mb-2 ${isMyanmar ? 'whitespace-nowrap max-sm:text-[0.9em] sm:text-[0.85em] lg:text-[0.72em]' : ''}`}>
                      {t('hero.title_suffix')}
                    </span>
                  </h1>
                  <p className={`text-base sm:text-lg text-slate-500 max-w-lg mx-auto xl:mx-0 leading-relaxed ${isMyanmar ? 'font-myanmar leading-relaxed sm:leading-loose pt-1 sm:pt-1' : ''}`}>
                    {t('hero.description')}
                  </p>
                </div>
              </div>

              {/* INTEGRATED SEARCH (Desktop) */}
              <div className="hidden xl:flex flex-col gap-3 p-3 bg-slate-50 border border-slate-100 rounded-none xl:flex-row max-w-2xl shadow-sm mx-auto xl:mx-0">
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-white border-slate-200 rounded-none px-5 py-3.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700 text-[17px] font-bold"
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
                  className={`w-full border-slate-200 rounded-none px-5 py-3.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-[17px] font-bold ${!brand ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}
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
                  className="w-full xl:w-auto bg-slate-900 text-white px-10 py-3.5 rounded-none font-bold hover:bg-indigo-600 active:scale-95 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 group text-[17px]"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Search</span>
                </button>
              </div>

              {/* Trust & Info Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-100 max-w-md mx-auto xl:mx-0">
                <div className="flex flex-col items-center xl:items-start group/stat">
                  <div className="flex items-center text-amber-500 mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-black text-slate-900 ml-1">4.9/5</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover/stat:text-indigo-600 transition-colors">Customer Rating</span>
                </div>
                <div className="flex flex-col items-center xl:items-start group/stat">
                  <Users className="w-4 h-4 text-indigo-400 mb-1 group-hover/stat:text-indigo-600 transition-colors" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover/stat:text-indigo-600 transition-colors">15k+ Happy Owners</span>
                </div>
                <div className="flex flex-col items-center xl:items-start group/stat">
                  <MapPin className="w-4 h-4 text-indigo-400 mb-1 group-hover/stat:text-indigo-600 transition-colors" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider group-hover/stat:text-indigo-600 transition-colors">{filterData?.showrooms?.length} branches</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Visual Content */}
            <div className="xl:col-span-6 relative order-1 xl:order-2">
              <div className="relative h-[320px] sm:h-[400px] md:h-[480px] xl:h-[520px] w-full mt-2 xl:mt-0 px-2 sm:px-0">
                <div className="absolute inset-0 rounded-none overflow-hidden shadow-3xl border-[6px] sm:border-[12px] border-slate-50 group/img">
                  <img
                    src={homeData?.image?.url || CarImage}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/img:scale-110"
                    alt="Kyaw Kyar Luxury SUV"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* MOBILE TITLE OVER IMAGE */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 xl:hidden h-28 flex flex-col justify-end pb-4 px-2 overflow-hidden">
                    {/* Integrated Blur & Gradient (No floating box) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent backdrop-blur-md -z-10" />
                    
                    <div className="text-center">
                      <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-800 whitespace-nowrap font-myanmar leading-tight drop-shadow-sm">
                        {t('hero.title_prefix')}
                      </h1>
                      <p className="text-[13px] text-white font-black tracking-widest uppercase mt-1 pb-1 drop-shadow-md">
                        {t('hero.title_suffix')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Badge on Card - Responsive: Top-right on mobile, Wide bar on desktop */}
                <div className="absolute z-20 transition-all duration-500 -top-4 -right-2 xl:top-auto xl:bottom-4 xl:left-10 xl:right-10">
                  <div className="bg-white/90 backdrop-blur-2xl border border-white p-4 sm:p-5 xl:p-6 rounded-none shadow-2xl flex flex-col xl:flex-row items-center justify-center gap-1 xl:gap-12 group/badge">
                    <p className="text-[10px] xl:text-[11px] text-indigo-600 font-black uppercase tracking-[0.2em] transition-colors group-hover/badge:text-indigo-500">
                      Monthly From
                    </p>
                    <div className="text-xl sm:text-2xl xl:text-4xl font-black text-slate-900 flex items-baseline gap-2 transition-transform group-hover/badge:scale-105">
                      300K <span className="text-slate-400 font-bold text-xs xl:text-lg">to</span> 2M
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


