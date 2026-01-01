import React from 'react';
import Hero from '../components/Hero';
import FeaturedCars from '../components/FeaturedCars';
import WhyBuyATKK from '../components/WhyBuyATKK';
import ShopByBrand from '../components/ShopByBrand';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturedCars />
      <ShopByBrand />
      <WhyBuyATKK />
    </div>
  );
};

export default Home;
