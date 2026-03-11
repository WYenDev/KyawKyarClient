import React from 'react';
import { useTranslation } from 'react-i18next';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';

const Reviews: React.FC = () => {
  const { t, i18n } = useTranslation('common');
  const lang = i18n.language.startsWith('my') ? 'my' : 'en';

  return (
    <div className="min-h-screen bg-blue-50 pt-8">
      <SEO
        lang={lang}
        canonical={`/${lang}/reviews`}
        title={t('reviews.meta.title', 'Customer Reviews - Kyaw Kyar Car Showroom')}
        description={t('reviews.meta.description', 'See what our customers say about their experience buying cars from Kyaw Kyar.')}
      />
      <Testimonials />
    </div>
  );
};

export default Reviews;