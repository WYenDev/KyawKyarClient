import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, DollarSign, Clock, ShieldCheck } from 'lucide-react';

const SellCarIntro: React.FC = () => {
  const { t, i18n } = useTranslation('cars');
  const isMyanmar = i18n?.language?.startsWith('mm');

  return (
    <div className="flex flex-col mb-2 sm:mb-4">
      <div>
        <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight md:leading-snug pt-0 sm:py-1 tracking-tight min-h-[36px] sm:min-h-0 ${isMyanmar ? 'font-myanmar sm:leading-relaxed max-sm:text-[1.6rem]' : ''}`}>
           <span className={`inline-block ${isMyanmar ? 'pt-4 pb-4' : 'pt-0 md:pt-1 pb-1'} text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600`}>
             {t('sell.title', 'Sell Your Car With Confidence')}
           </span>
        </h1>
        <p className={`text-base sm:text-lg text-slate-600 mt-3 sm:mt-4 leading-relaxed min-h-[72px] sm:min-h-0 ${isMyanmar ? 'font-myanmar' : ''}`}>
          {t('sell.description', 'Fill out the form with your car’s details, and our team will get back to you with a competitive offer. Selling your car has never been easier.')}
        </p>
      </div>
    </div>
  );
};

export default SellCarIntro;
