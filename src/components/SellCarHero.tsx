import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Shield, Clock, BadgeDollarSign } from 'lucide-react';

const SellCarHero: React.FC = () => {
  const { t, i18n } = useTranslation('cars');
  const isMyanmar = i18n?.language?.startsWith('mm');

  return (
    <div>
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-4">
        <Car className="h-4 w-4 mr-2" />
        <span>{t('sell.details_title')}</span>
      </div>
      <h1 className={`text-3xl sm:text-5xl font-bold text-white mb-4 ${isMyanmar ? 'font-myanmar max-sm:text-[2.2rem]' : ''}`}>{t('sell.title')}</h1>
      <p className="text-lg text-slate-300 mb-4">{t('sell.description')}</p>
      <p className="text-sm text-slate-400 mb-6">{t('sell.form_subtitle')}</p>

      <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-3">
        {t('sell.highlights_title')}
      </h2>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-100">
              {t('sell.highlights.fast_process_title')}
            </p>
            <p className="text-sm text-slate-400">{t('sell.highlights.fast_process_desc')}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <BadgeDollarSign className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-100">
              {t('sell.highlights.best_price_title')}
            </p>
            <p className="text-sm text-slate-400">{t('sell.highlights.best_price_desc')}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Shield className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-100">
              {t('sell.highlights.trusted_title')}
            </p>
            <p className="text-sm text-slate-400">{t('sell.highlights.trusted_desc')}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <BadgeDollarSign className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-100">
              {t('sell.highlights.secure_payment_title')}
            </p>
            <p className="text-sm text-slate-400">{t('sell.highlights.secure_payment_desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCarHero;
