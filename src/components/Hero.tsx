import React, { useEffect, useState } from 'react';
import { Search, Award, Car, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo-with-text.png';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label }) => (
  <div className="flex items-center space-x-4">
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-100">
      {icon}
    </div>
    <div>
      <div className="text-xl font-semibold text-slate-900">{value}</div>
      <div className="text-sm text-slate-600">{label}</div>
    </div>
  </div>
);

const Hero: React.FC = () => {
  const { t } = useTranslation('home');
  const { t: tCommon } = useTranslation('common');
  const navigate = useNavigate();

  const goToInventory = () => navigate('/buyCars');

  // show scroll hint only if featured section has content
  const [showScrollHint, setShowScrollHint] = useState<boolean>(false);

  useEffect(() => {
    const featured = document.getElementById('featured');
    if (!featured) return;

    const evaluate = () => {
      // consider there is content if there are child nodes (cards) or height > 0
      const hasChildren = featured.childElementCount > 0;
      const hasHeight = featured.scrollHeight > 0;
      setShowScrollHint(hasChildren && hasHeight);
    };

    evaluate();

    const mo = new MutationObserver(evaluate);
    mo.observe(featured, { childList: true, subtree: true });

    // also re-evaluate on resize (layout changes)
    window.addEventListener('resize', evaluate);

    return () => {
      mo.disconnect();
      window.removeEventListener('resize', evaluate);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white flex items-center h-screen"
      aria-label={t('hero.aria') || 'Hero'}
    >
      {/* Decorative soft blobs (subtle, light) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.06), transparent 40%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 bottom-0 w-[360px] h-[360px] rounded-full blur-2xl opacity-25"
        style={{ background: 'radial-gradient(circle at 70% 70%, rgba(14,165,233,0.04), transparent 40%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 items-center gap-12 py-16">
          {/* Left: focused content (badge, headline, description, quick search) */}
          <div className="z-10">
            <div className="relative max-w-2xl pl-10">
              {/* accent stripe (kept) */}
              <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-lg bg-gradient-to-b from-indigo-600 to-violet-400" />

              {/* soft decorative circle retained for depth */}
              <div aria-hidden className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-gradient-to-br from-indigo-100 to-transparent opacity-40 blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center px-4 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-3">
                  {t('hero.badge') || 'Trusted in Myanmar'}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-3 text-slate-900">
                  <span className="block">{t('hero.title_prefix') || 'Find your next'}</span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">{t('hero.title_suffix') || 'perfect car'}</span>
                </h1>

                <p className="text-base text-slate-600 max-w-2xl mb-6">
                  {t('hero.description') ||
                    'Myanmar’s trusted used car marketplace — search, compare and contact sellers quickly.'}
                </p>

                {/* faux search / quick-filter UI (visual only) */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-1 flex items-center gap-3 bg-gradient-to-r from-white to-slate-50 border border-slate-100 rounded-full px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-100">
                      <Search className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-slate-400 text-sm">Search by brand, model or year</span>
                  </div>

                  <button
                    onClick={goToInventory}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full font-semibold shadow-lg transition"
                  >
                    <span className="text-sm">{tCommon('buttons.browse_cars') || 'Browse'}</span>
                  </button>
                </div>

                {/* compact CTA row (left) */}
                <div className="flex items-center gap-4">
                  <button onClick={goToInventory} className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold shadow">{tCommon('buttons.browse_cars') || 'Browse cars'}</button>
                  <button className="border border-slate-100 text-slate-700 px-4 py-2 rounded-lg">{tCommon('buttons.get_consultation') || 'Get consultation'}</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: modern showcase card (light) - expanded with categories + stats */}
          <div className="z-10 flex items-center justify-center">
            <div className="relative w-full max-w-lg lg:max-w-xl">
              <div className="rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:-translate-y-1 bg-white p-8 border border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Featured</div>
                    <div className="text-2xl font-semibold text-slate-900 mt-2">Top picks this week</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">From</div>
                    <div className="text-lg font-semibold text-slate-900">MMK 12,500,000</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="h-28 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-700 font-medium">Sedan</div>
                  <div className="h-28 rounded-lg bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center text-rose-600 font-medium">SUV</div>
                  <div className="h-28 rounded-lg bg-gradient-to-br from-emerald-100 to-lime-50 flex items-center justify-center text-emerald-700 font-medium">Hatch</div>
                </div>

                {/* moved feature tiles here */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                    <div className="text-sm text-indigo-700 font-semibold">New arrivals</div>
                    <div className="text-xs text-slate-500">Latest models added</div>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-100">
                    <div className="text-sm text-rose-600 font-semibold">Top sellers</div>
                    <div className="text-xs text-slate-500">Popular picks</div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                    <div className="text-sm text-emerald-700 font-semibold">Great deals</div>
                    <div className="text-xs text-slate-500">Value cars under budget</div>
                  </div>
                </div>

                {/* moved stats here */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatItem icon={<Car className="w-5 h-5 text-indigo-600" />} value="5000+" label={t('stats.cars_sold') || 'Cars sold'} />
                    <StatItem icon={<Award className="w-5 h-5 text-indigo-600" />} value="15+" label={t('stats.years_experience') || 'Years'} />
                    <StatItem icon={<Search className="w-5 h-5 text-indigo-600" />} value="200+" label={t('stats.cars_available') || 'Available'} />
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">View picks</button>
                  <div className="text-sm text-slate-400">Updated weekly</div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-6 bg-white p-3 rounded-lg shadow">
                <img src={logo} alt="ကျော်ကြား car showroom" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0,32 C360,120 1080,0 1440,64 L1440,120 L0,120 Z" fill="rgba(15,23,42,0.02)"></path>
      </svg>

      {/* Scroll hint -> only visible when featured section likely has items */}
      {showScrollHint && (
        <button
          type="button"
          onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to featured cars"
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-8 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 shadow hover:bg-indigo-100 transition"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      )}

      {/* Bottom fade into page background (white) */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-full h-40 sm:h-56 pointer-events-none z-30 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  );
};

export default Hero;
