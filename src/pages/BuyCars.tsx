import React from 'react';
import { useTranslation } from 'react-i18next';
import CarInventory from '../components/CarInventory';
import SEO from '../components/SEO';

const BuyCars: React.FC = () => {
  const { t, i18n } = useTranslation('cars');
  const lang = i18n.language.startsWith('my') ? 'my' : 'en';

  return (
    <div className="min-h-screen bg-gray-50 pt-4 xl:pt-8">
      <SEO
        lang={lang}
        canonical="/buyCars"
        title={t('meta.title', 'Browse Cars for Sale in Myanmar')}
        description={t(
          'meta.description',
          'Search Kyaw Kyar’s curated inventory of inspected vehicles by brand, model, price, and showroom location.'
        )}
      />
      <CarInventory />
    </div>
  );
};

export default BuyCars;
