import React from 'react';
import Hero from '../components/Hero';
import FeaturedCars from '../components/FeaturedCars';
import WhyBuyATKK from '../components/WhyBuyATKK';
import AboutTeaser from '../components/AboutTeaser';
//import ShopByBrand from '../components/ShopByBrand';
import NewArrivals from '../components/NewArrivals';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FeaturedCars />
      <NewArrivals />
      <WhyBuyATKK />
      <AboutTeaser />
    </div>
  );
};

export default Home;
