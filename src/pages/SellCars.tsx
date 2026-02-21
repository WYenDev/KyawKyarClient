import React from 'react';
import { useTranslation } from 'react-i18next';
import SellCarForm from '../components/SellCarForm';
import WhySellWithUs from '../components/WhySellWithUs';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';

const SellCars: React.FC = () => {
  const { t } = useTranslation('cars');

  return (
    <div className="min-h-screen bg-[#f8fafc] py-2 lg:py-3">
      <SEO 
        title={t('sell_meta.title', 'Sell Your Car')}
        description={t('sell_meta.description', 'Sell your car with confidence')}
        canonical="/sellCars"
      />
      <ScrollToTop />
      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          <div className="lg:col-span-8">
            <SellCarForm />
          </div>

          <div className="lg:col-span-4 sticky top-28 space-y-4 sm:space-y-6">
            <WhySellWithUs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCars;
