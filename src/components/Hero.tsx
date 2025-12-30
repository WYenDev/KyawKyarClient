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
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/6 backdrop-blur-sm">
      {icon}
    </div>
    <div>
      <div className="text-xl font-semibold text-white">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
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
      className="relative overflow-hidden h-screen flex items-center"
      aria-label={t('hero.aria') || 'Hero'}
    >
      {/* Base gradient for site theme (lighter purple/violet) */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-400 to-indigo-500" />

      {/* Decorative soft blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.42), transparent 40%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 w-[420px] h-[420px] rounded-full blur-2xl opacity-25"
        style={{ background: 'radial-gradient(circle at 70% 70%, rgba(167,139,250,0.28), transparent 40%)' }}
      />

      {/* Subtle textured overlay */}
      <div className="absolute inset-0 mix-blend-overlay bg-[linear-gradient(0deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 items-center gap-12 min-h-[78vh]">
          {/* Left: content */}
          <div className="z-10">
            <div className="inline-flex items-center px-4 py-1 rounded-full bg-amber-500/95 text-sm font-medium mb-6 shadow-sm">
              {t('hero.badge') || 'Trusted in Myanmar'}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
              <span className="block">{t('hero.title_prefix') || 'Find your next'}</span>
              <span className="block text-indigo-300">{t('hero.title_suffix') || 'perfect car'}</span>
            </h1>

            <p className="text-lg text-white/85 max-w-2xl mb-8">
              {t('hero.description') ||
                'Myanmar’s trusted used car marketplace — search, compare and contact sellers quickly.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={goToInventory}
                className="inline-flex items-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition"
              >
                <Search className="w-5 h-5" />
                {tCommon('buttons.browse_cars') || 'Browse cars'}
              </button>

              <button
                className="inline-flex items-center gap-3 border border-white/20 text-white/95 px-6 py-3 rounded-lg font-semibold hover:bg-white/5 transition"
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              >
                <Award className="w-5 h-5" />
                {tCommon('buttons.get_consultation') || 'Get consultation'}
              </button>
            </div>

            <div className="mt-6 p-4 rounded-xl w-full md:w-auto backdrop-blur-md bg-black/30 border border-white/6 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatItem icon={<Car className="w-5 h-5 text-indigo-300" />} value="5000+" label={t('stats.cars_sold') || 'Cars sold'} />
                <StatItem icon={<Award className="w-5 h-5 text-indigo-300" />} value="15+" label={t('stats.years_experience') || 'Years'} />
                <StatItem icon={<Search className="w-5 h-5 text-indigo-300" />} value="200+" label={t('stats.cars_available') || 'Available'} />
              </div>
            </div>
          </div>

          {/* Right: modern showcase card adapted to site theme (no white background) */}
          <div className="z-10 flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105 bg-black/30 backdrop-blur-md border border-white/6 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-white/70">Featured</div>
                    <div className="text-xl font-semibold text-white mt-2">Top picks this week</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/60">From</div>
                    <div className="text-lg font-semibold text-white">MMK 12,500,000</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="h-24 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-300 opacity-95 flex items-center justify-center text-white font-medium">
                    Sedan
                  </div>
                  <div className="h-24 rounded-lg bg-gradient-to-br from-rose-500 to-pink-300 opacity-95 flex items-center justify-center text-white font-medium">
                    SUV
                  </div>
                  <div className="h-24 rounded-lg bg-gradient-to-br from-emerald-500 to-lime-300 opacity-95 flex items-center justify-center text-white font-medium">
                    Hatch
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <button className="px-4 py-2 bg-white/10 text-white rounded-md border border-white/8">View picks</button>
                  <div className="text-sm text-white/60">Updated weekly</div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-6 bg-white/90 text-slate-900 p-3 rounded-lg shadow">
                <img src={logo} alt="ကျော်ကြား car showroom" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path d="M0,32 C360,120 1080,0 1440,64 L1440,120 L0,120 Z" fill="rgba(255,255,255,0.02)"></path>
      </svg>

      {/* Scroll hint -> only visible when featured section likely has items */}
      {showScrollHint && (
        <button
          type="button"
          onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll to featured cars"
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-8 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white shadow-lg hover:bg-white/20 transition"
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
