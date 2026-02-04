import React from 'react';
import { useTranslation } from 'react-i18next';
import SellCarIntro from '../components/SellCarIntro';
import SellCarForm from '../components/SellCarForm';
import WhySellWithUs from '../components/WhySellWithUs';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';

const SellCars: React.FC = () => {
  const { t } = useTranslation('cars');

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <SEO 
        title={t('sell_meta.title', 'Sell Your Car')}
        description={t('sell_meta.description', 'Sell your car with confidence')}
        canonical="/sell-cars"
      />
      <ScrollToTop />
      <div className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <SellCarIntro />
              </div>

              <SellCarForm />
            </div>

            <div className="lg:col-span-1">
              <WhySellWithUs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCars;
