import React from 'react';
import { useTranslation } from 'react-i18next';
import { DollarSign, FastForward, ShieldCheck, Car } from 'lucide-react';

const SellCarIntro: React.FC = () => {
  const { t } = useTranslation('cars');

  return (
    <div className="lg:sticky top-10">
      <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 mb-4">
        <Car className="h-4 w-4 mr-2" />
        <span>{t('sell.intro_badge', 'Simple & Quick')}</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
        {t('sell.title', 'Sell Your Car With Confidence')}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        {t(
          'sell.description',
          'Fill out the form with your car’s details, and our team will get back to you with a competitive offer. Selling your car has never been easier.',
        )}
      </p>

    </div>
  );
};

export default SellCarIntro;
