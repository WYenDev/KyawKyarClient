import React, { useEffect, useState, useMemo } from 'react';
import { Search, ShieldCheck, Star, Users, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetApiCarsFilters } from '../services/api';
import { brands as localBrands, brandModels as localBrandModels } from '../data/cars';
import CarImage from '../assets/cars.jpg';

const Hero: React.FC = () => {
  const { t } = useTranslation('home');
  const navigate = useNavigate();
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');

  const { data: filterData } = useGetApiCarsFilters();
  const serverBrands = filterData?.brandsWithModels ? Object.keys(filterData.brandsWithModels) : undefined;
  const serverBrandModels = filterData?.brandsWithModels ?? undefined;
  const brandsToShow = serverBrands && serverBrands.length > 0 ? serverBrands : localBrands;

  const normalizeModelsForBrand = (brandKey?: string) => {
    if (!brandKey) return [] as { id: string; name: string }[];
    const raw = (serverBrandModels && serverBrandModels[brandKey]) ?? localBrandModels[brandKey] ?? [];
    if (raw.length === 0) return [] as { id: string; name: string }[];
    if (typeof raw[0] === 'string') {
      return (raw as string[]).map(name => ({ id: name, name }));
    }
    return (raw as { id?: string; name?: string }[]).map(m => ({ id: m.id ?? m.name ?? String(m), name: m.name ?? m.id ?? String(m) }));
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
    <section 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${CarImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-white text-[11px] font-bold tracking-widest uppercase">
              Kyaw Kyar Premium Showroom
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black leading-tight md:leading-snug">
            <span className="block mb-2">
              {t('hero.title_prefix')}
            </span>
            <span className="inline-block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
              {t('hero.title_suffix')}
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>

        {/* INTEGRATED SEARCH */}
        <div className="mt-10 flex flex-col gap-3 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl lg:flex-row max-w-3xl mx-auto shadow-lg">
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full bg-white/10 border-white/20 rounded-lg px-5 py-3.5 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all text-white placeholder-slate-300"
          >
            <option value="" className="text-black">All Brands</option>
            {brandsToShow.map((b) => (
              <option key={b} value={b} className="text-black">{b}</option>
            ))}
          </select>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!brand}
            className={`w-full bg-white/10 border-white/20 rounded-lg px-5 py-3.5 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all ${!brand ? 'text-slate-400' : 'text-white'}`}
          >
            <option value="" className="text-black">All Models</option>
            {availableModels.map((m) => (
              <option key={m.id} value={m.id} className="text-black">{m.name}</option>
            ))}
          </select>

          <button
            onClick={() => navigateWithParams(brand || undefined, model || undefined)}
            className="w-full lg:w-auto bg-white text-slate-900 px-8 py-3.5 rounded-lg font-bold hover:bg-indigo-200 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Search</span>
          </button>
        </div>

        {/* Trust & Info Row */}
        <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-white/20 max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-amber-300 mb-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-white ml-1">4.9/5</span>
            </div>
            <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">Customer Rating</span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-4 h-4 text-white mb-1" />
            <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">15k+ Happy Owners</span>
          </div>
          <div className="flex flex-col items-center">
            <MapPin className="w-4 h-4 text-white mb-1" />
            <span className="text-[10px] text-slate-300 font-medium uppercase tracking-wider">{filterData?.showrooms?.length} branches</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;