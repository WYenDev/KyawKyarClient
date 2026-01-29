import React from 'react';
import { ShieldCheck, BadgeCheck, Banknote, History, Zap, Contact } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhyBuyAtKyawKyar: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const isMyanmar = i18n?.language?.startsWith('mm');
  const benefits = [
    {
      title: t('whybuy.benefits.inspection.title'),
      description: t('whybuy.benefits.inspection.description'),
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50"
    },
    {
      title: t('whybuy.benefits.financing.title'),
      description: t('whybuy.benefits.financing.description'),
      icon: <Banknote className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50"
    },
    {
      title: t('whybuy.benefits.swift-processing.title'),
      description: t('whybuy.benefits.swift-processing.description'),
      icon: <History className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50"
    },
    {
      title: t('whybuy.benefits.clean-history.title'),
      description: t('whybuy.benefits.clean-history.description'),
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50"
    },
    {
      title: t('whybuy.benefits.buy-at-market-price.title'),
      description: t('whybuy.benefits.buy-at-market-price.description'),
      icon: <BadgeCheck className="w-6 h-6 text-violet-600" />,
      bg: "bg-violet-50"
    },
    {
      title: t('whybuy.benefits.support.title'),
      description: t('whybuy.benefits.support.description'),
      icon: <Contact className="w-6 h-6 text-rose-600" />,
      bg: "bg-rose-50"
    }
  ];

  return (
    <section className="min-h-screen flex items-center bg-white relative overflow-hidden py-12 lg:py-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">
            The KyawKyar Standard
          </h2>
          <h3 className={`
  text-4xl lg:text-5xl font-black text-slate-900 mb-6
  ${isMyanmar ? 'leading-[1.5] lg:leading-[1.6]' : 'leading-tight'}
`}>
            <span className={`${isMyanmar && 'text-indigo-600'}`}>
              {t('whybuy.title_prefix')}
            </span>
            <br />
            <span className={`${!isMyanmar && 'text-indigo-600'}`}>
              {t('whybuy.title_suffix')}
            </span>
          </h3>          <p className="text-slate-600 text-lg">
            {t('whybuy.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`${benefit.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {benefit.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {benefit.title}
              </h4>
              <p className="text-slate-500 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBuyAtKyawKyar;
