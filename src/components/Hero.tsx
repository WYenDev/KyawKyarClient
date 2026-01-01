import React, { useEffect, useState, useMemo } from 'react';
import { Search, ChevronDown, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useGetApiCarsFilters } from '../services/api';
import { brands as localBrands, brandModels as localBrandModels } from '../data/cars';

const Hero: React.FC = () => {
  const { t } = useTranslation('home');
  const navigate = useNavigate();
  const [showScrollHint, setShowScrollHint] = useState<boolean>(false);

  // Brand / Model state (match BuyCars filter behavior)
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');

  useEffect(() => {
    const featured = document.getElementById('featured');
    if (featured) setShowScrollHint(true);
  }, []);

  // Fetch server-side filter metadata (brands & models)
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
    // if selected model is not available for the brand, clear it
    if (model) {
      const found = availableModels.some(m => m.id === model || m.name === model);
      if (!found) setModel('');
    }
  }, [brand, availableModels]);


  return (
    <section className="relative min-h-screen flex items-center bg-slate-50 overflow-hidden">
      {/* BACKGROUND DECORATION: Subtle Mesh Gradient for the "Luxury" feel */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-100/40 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* LEFT SIDE: (Occupies 5 columns) */}
          <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm animate-fade-in">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span className="text-slate-700 text-sm font-semibold tracking-wide uppercase">
                {t('hero.badge', "Mandalay's Premier Multi-Brand Showroom")}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Every Grade. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600">
                Every Budget.
              </span>
            </h1>

            <p className="text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              From reliable daily commuters like <span className="font-bold text-slate-800">Suzuki & Toyota</span> to the ultimate luxury of <span className="font-bold text-slate-800">Lexus & Range Rover</span>. Certified quality for every driver.
            </p>

            {/* Brand / Model selects (match BuyCars filters) */}
            <div className="flex gap-3 items-center max-w-md mx-auto lg:mx-0">
              <div className="flex-1">
                <label className="sr-only">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-3 py-3 text-sm shadow-sm bg-white"
                >
                  <option value="">All Brands</option>
                  {brandsToShow.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label className="sr-only">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                  className={`w-full border border-slate-200 rounded-md px-3 py-3 text-sm shadow-sm ${!brand ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900'}`}
                >
                  <option value="">All Models</option>
                  {availableModels.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  onClick={() => navigateWithParams(brand || undefined, model || undefined)}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow hover:shadow-md"
                >
                  <Search className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('hero.search_cta', 'Search')}</span>
                </button>
              </div>
            </div>

            {/* QUICK STATS - Horizontal for better flow */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4 text-slate-500 text-sm">
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> Instant Finance Approval</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 150+ Point Inspection</div>
            </div>
          </div>

          {/* RIGHT SIDE: (Occupies 7 columns) - THE MULTI-CAR GRID */}
          <div className="lg:col-span-7 relative h-[500px] lg:h-[650px] grid grid-cols-2 grid-rows-6 gap-4 animate-fade-in-right pt-6">

            {/* LARGE IMAGE: THE LUXURY FLAGSHIP (LX600 / Range Rover) */}
            <div className="col-span-1 row-span-4 relative rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white">
              <img
                src="https://images.hdqwalls.com/download/lexus-lx-570-suv-4k-1440x900.jpg"
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                alt="Luxury SUV"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Premium</p>
                <h3 className="text-xl font-bold">Luxury SUV</h3>
              </div>
            </div>

            {/* TOP RIGHT: THE DAILY COMMUTER (Toyota Crown / Camry) */}
            <div className="col-span-1 row-span-3 relative rounded-[2rem] overflow-hidden shadow-xl group border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Daily Sedan"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">Efficiency</p>
                <h3 className="text-lg font-bold">Daily Sedan</h3>
              </div>
            </div>

            {/* BOTTOM RIGHT: THE FAMILY / HATCHBACK (Suzuki / Honda) */}
            <div className="col-span-1 row-span-3 relative rounded-[2rem] overflow-hidden shadow-xl group border-4 border-white">
              <img
                src="https://car-images.bauersecure.com/wp-images/4485/volvoxc40.jpg"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="City Compact"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-50" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">City</p>
                <h3 className="text-lg font-bold">Family Compact</h3>
              </div>
            </div>

            {/* FLOATING FINANCE CARD: Positioned to overlap the center gap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white/95 backdrop-blur px-6 py-4 rounded-3xl shadow-2xl border border-indigo-50 animate-bounce-slow">
              <div className="text-center">
                <div className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em]">Finance Range</div>
                <div className="text-2xl font-black text-slate-900 leading-none mt-1">
                  300K <span className="text-slate-400 font-normal text-sm">to</span> 2M
                </div>
                <div className="text-[10px] text-slate-400 font-medium">MMK Monthly Estimate</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SCROLL HINT */}
      {showScrollHint && (
        <button
          onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 text-slate-300 hover:text-indigo-600 transition-colors animate-bounce"
        >
          <ChevronDown className="w-8 h-8" />
        </button>
      )}
    </section>
  );
};

export default Hero;
