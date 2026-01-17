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
  const [showScrollHint, setShowScrollHint] = useState<boolean>(false);
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');

  useEffect(() => {
    const featured = document.getElementById('featured');
    if (featured) setShowScrollHint(true);
  }, []);

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
    <section className="relative min-h-screen flex items-center bg-white overflow-hidden pt-20 lg:pt-0">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-15%] left-[-15%] w-[80%] h-[70%] rounded-full bg-indigo-50/50 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[60%] rounded-full bg-blue-50/40 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT SIDE: Content */}
          <div className="lg:col-span-6 space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white border border-slate-200/80 px-4 py-2 rounded-full shadow-sm">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-indigo-900 text-[11px] font-bold tracking-widest uppercase">
                  Kyaw Kyar Premium Showroom
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight md:leading-snug py-4">
                <span className="block mb-2">
                  {t('hero.title_prefix')}
                </span>
                <span className="inline-block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {t('hero.title_suffix')}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            {/* INTEGRATED SEARCH */}
            <div className="flex flex-col gap-3 p-4 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl lg:flex-row max-w-2xl shadow-lg">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-white border-slate-300 rounded-lg px-5 py-3.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-700"
              >
                <option value="">All Brands</option>
                {brandsToShow.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!brand}
                className={`w-full border-slate-300 rounded-lg px-5 py-3.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${!brand ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}
              >
                <option value="">All Models</option>
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>

              <button
                onClick={() => navigateWithParams(brand || undefined, model || undefined)}
                className="w-full lg:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2 group"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Search</span>
              </button>
            </div>

            {/* Trust & Info Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <div className="flex items-center text-amber-500 mb-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-bold text-slate-900 ml-1">4.9/5</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Customer Rating</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <Users className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">15k+ Happy Owners</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <MapPin className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{filterData?.showrooms?.length} branches</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Visual Content */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <div className="relative h-[250px] sm:h-[350px] lg:h-[500px] w-full">
              <div className="absolute inset-0 rounded-3xl lg:rounded-4xl overflow-hidden shadow-2xl border-8 lg:border-12 border-white group">
                <img
                  src={CarImage}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-105"
                  alt="Kyaw Kyar Luxury SUV"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-8 -right-4 lg:bottom-8 lg:-left-16 z-20">
                <div className="bg-white/80 backdrop-blur-xl border border-white p-5 lg:p-7 rounded-2xl lg:rounded-3xl shadow-xl animate-float">
                  <div className="text-center">
                    <p className="text-xs lg:text-sm text-indigo-600 font-bold uppercase tracking-widest mb-1">
                      Monthly From
                    </p>
                    <div className="text-xl lg:text-3xl font-black text-slate-900 flex items-baseline justify-center gap-1.5">
                      300K <span className="text-slate-500 font-medium text-xs lg:text-base">to</span> 2M
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
