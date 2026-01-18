import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, FastForward, ShieldCheck, Award } from 'lucide-react';

const WhySellWithUs: React.FC = () => {
  const { t } = useTranslation('cars');

  const benefits = [
    {
      icon: DollarSign,
      title: t('sell.benefits.fair_offer_title', 'Get a Fair Offer'),
      description: t(
        'sell.benefits.fair_offer_desc',
        'We provide a competitive and transparent valuation for your vehicle based on market data.',
      ),
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      icon: FastForward,
      title: t('sell.benefits.fast_easy_title', 'Fast and Easy Process'),
      description: t(
        'sell.benefits.fast_easy_desc',
        'Our streamlined process gets you from submission to sale in no time, with no hidden steps.',
      ),
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: ShieldCheck,
      title: t('sell.benefits.secure_payment_title', 'Secure & Transparent'),
      description: t(
        'sell.benefits.secure_payment_desc',
        'Receive your payment through safe channels. We handle all the paperwork for you.',
      ),
      color: 'text-rose-500',
      bg: 'bg-rose-50',
    },
    {
      icon: Award,
      title: t('sell.benefits.trusted_partner_title', 'Trusted Partner'),
      description: t(
        'sell.benefits.trusted_partner_desc',
        'With years of experience, we are a trusted name in the car industry.',
      ),
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 lg:sticky top-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('sell.why_sell_title', 'Why Sell With TKK?')}
      </h2>
      <div className="space-y-6">
        {benefits.map((item, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${item.bg}`}
            >
              <item.icon className={`h-6 w-6 ${item.color}`} strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhySellWithUs;
