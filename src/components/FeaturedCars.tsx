import React from 'react';
import { Star } from 'lucide-react';
import { useGetApiCarsFeatured } from '../services/api';
import CarCarousel from './CarCarousel';
import { useTranslation } from 'react-i18next';

const FeaturedCars: React.FC = () => {

  const { t } = useTranslation('home');
  return (
    <CarCarousel
      id="featured"
      badgeText="Featured Showroom"
      badgeIcon={<Star />}
      bg='bg-gray-50'
      title={t('featured.title')}
      highlightedTitle={t('featured.highlightedText')}
      useDataHook={useGetApiCarsFeatured}
      theme="indigo"
    />
  );
};

export default FeaturedCars;
