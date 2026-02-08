import React from 'react';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import FeaturedCars from '../components/FeaturedCars';
import WhyBuyATKK from '../components/WhyBuyATKK';
import AboutTeaser from '../components/AboutTeaser';
import ShowroomSection from '../components/ShowroomSection';
//import ShopByBrand from '../components/ShopByBrand';
import NewArrivals from '../components/NewArrivals';
import BrowseCarByBuildTypes from '../components/BrowseCarByBuildTypes';
import BrowseCarByBrands from '../components/BrowseCarByBrands';
import SEO, { SITE_URL } from '../components/SEO';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const lang = i18n.language.startsWith('mm') ? 'my' : 'en';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kyaw Kyar Car Showroom',
    url: SITE_URL,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'MM',
      availableLanguage: ['my', 'en']
    }
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kyaw Kyar Car Showroom',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/buyCars?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <SEO
        lang={lang}
        canonical="/"
        title={t('meta.title', 'Kyaw Kyar Car Showroom | Buy & Sell Quality Vehicles')}
        description={t(
          'meta.description',
          'Myanmar’s trusted destination for inspected cars, financing support, and premium after-sales service.'
        )}
        structuredData={[organizationSchema, webSiteSchema]}
      />
      <Hero />
      <FeaturedCars />
      <NewArrivals />
      <BrowseCarByBuildTypes />
      <BrowseCarByBrands />
      <WhyBuyATKK />
      <ShowroomSection />
      <AboutTeaser />
    </div>
  );
};

export default Home;
