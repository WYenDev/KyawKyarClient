import React from 'react';
import { Star } from 'lucide-react';
import { useGetApiCarsFeatured } from '../services/api';
import CarCarousel from './CarCarousel';

const FeaturedCars: React.FC = () => {
  return (
    <CarCarousel
      id="featured"
      badgeText="Featured Showroom"
      badgeIcon={<Star />}
      title="Top Tier"
      highlightedTitle="Selection"
      description="Carefully inspected vehicles ranging from city commuters to luxury SUVs. Quality guaranteed for the Myanmar roads."
      useDataHook={useGetApiCarsFeatured}
      theme="indigo"
    />
  );
};

export default FeaturedCars;
