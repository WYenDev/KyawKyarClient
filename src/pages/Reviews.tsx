import React from 'react';
import { useTranslation } from 'react-i18next';
import Testimonials from '../components/Testimonials';
import SEO from '../components/SEO';

const Reviews: React.FC = () => {
  const { t } = useTranslation('reviews');

  return (
    <div className="min-h-screen bg-blue-50 pt-8">
      <SEO
        canonical="/reviews"
        title={t('title', 'Customer Reviews') + ' - Kyaw Kyar'}
        description={t(
          'subtitle',
          'Read what our customers say about their experience with Kyaw Kyar Car Showroom.'
        )}
      />
      <Testimonials />
    </div>
  );
};

export default Reviews;