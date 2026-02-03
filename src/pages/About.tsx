import React from 'react';
import { useTranslation } from 'react-i18next';
//import AboutComponent from '../components/About';
import AboutContact from '../components/AboutAndContact';
import ScrollToTop from '../components/ScrollToTop';
import SEO from '../components/SEO';

const About: React.FC = () => {
  const { t, i18n } = useTranslation('about');
  const lang = i18n.language.startsWith('mm') ? 'my' : 'en';

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <SEO
        lang={lang}
        canonical="/about"
        title={t('meta.title', 'About Kyaw Kyar Car Showroom')}
        description={t(
          'meta.description',
          'Learn how Kyaw Kyar Car Showroom delivers transparent inspections, fair pricing, and premium after-sales support across Myanmar.'
        )}
      />
      <ScrollToTop />
      <AboutContact />
    </div>
  );
};

export default About;
