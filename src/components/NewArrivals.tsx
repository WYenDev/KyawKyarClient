import React from 'react';
import { Star } from 'lucide-react';
import { useGetApiCarsNewArrivals } from '../services/api';
import CarCarousel from './CarCarousel';
import { useTranslation } from 'react-i18next';

const NewArrivals: React.FC = () => {

  const { t } = useTranslation('home');
  return (
    <CarCarousel
      id="new-arrivals"
      badgeText="New Arrivals"
      badgeIcon={<Star />}
      title={t('new_arrivals.title')}
      highlightedTitle={t('new_arrivals.highlightedText')}
      bg='bg-white'
      useDataHook={useGetApiCarsNewArrivals}
      theme="amber"
    />
  );
};

export default NewArrivals;
