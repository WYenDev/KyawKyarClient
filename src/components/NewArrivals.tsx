import React from 'react';
import { Star } from 'lucide-react';
import { useGetApiCarsNewArrivals } from '../services/api';
import CarCarousel from './CarCarousel';

const NewArrivals: React.FC = () => {
  return (
    <CarCarousel
      id="new-arrivals"
      badgeText="New Arrivals"
      badgeIcon={<Star />}
      title="Fresh"
      bg='bg-white'
      highlightedTitle="Inventory"
      description="Recently added vehicles inspected and ready for the road."
      useDataHook={useGetApiCarsNewArrivals}
      theme="amber"
    />
  );
};

export default NewArrivals;
