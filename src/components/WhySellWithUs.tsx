import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, FastForward, ShieldCheck, Award } from 'lucide-react';

const WhySellWithUs: React.FC = () => {
  const { t, i18n } = useTranslation('cars');
  const isMyanmar = i18n?.language?.startsWith('mm');

  const benefits = [
    {
      icon: DollarSign,
      title: t('sell.benefits.fair_offer_title', 'Get a Fair Offer'),
      description: t(
        'sell.benefits.fair_offer_desc',
        'We provide a competitive and transparent valuation for your vehicle based on market data.',
      ),
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: FastForward,
      title: t('sell.benefits.fast_easy_title', 'Fast and Easy Process'),
      description: t(
        'sell.benefits.fast_easy_desc',
        'Our streamlined process gets you from submission to sale in no time, with no hidden steps.',
      ),
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: ShieldCheck,
      title: t('sell.benefits.secure_payment_title', 'Secure & Transparent'),
      description: t(
        'sell.benefits.secure_payment_desc',
        'Receive your payment through safe channels. We handle all the paperwork for you.',
      ),
      color: 'text-blue-600',
      bg: 'bg-blue-100/50',
    },
    {
      icon: Award,
      title: t('sell.benefits.trusted_partner_title', 'Trusted Partner'),
      description: t(
        'sell.benefits.trusted_partner_desc',
        'With years of experience, we are a trusted name in the car industry.',
      ),
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className={`text-lg font-black mb-6 flex items-center gap-2 tracking-tight ${isMyanmar ? 'font-myanmar leading-relaxed' : ''}`}>
        <ShieldCheck className="w-5 h-5 text-indigo-600" />
        <span className="inline-block pt-2 pb-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          {t('sell.why_sell_title', 'Why Sell With TKK?')}
        </span>
      </h3>
      
      <div className="space-y-5">
        {benefits.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
              <item.icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h4 className={`text-sm font-bold text-slate-800 mb-0.5 ${isMyanmar ? 'font-myanmar leading-relaxed' : ''}`}>
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 leading-normal">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center gap-3">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
          ))}
        </div>
        <p className="text-[11px] text-indigo-700 font-medium leading-tight">
          {t('sell.footer_note', 'Join 1,000+ happy sellers this month')}
        </p>
      </div>
    </div>
  );
};

export default WhySellWithUs;
