import React from 'react';
import { useTranslation } from 'react-i18next';
import ContactComponent from '../components/Contact';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const { t } = useTranslation('contact');

  return (
    <div className="min-h-screen bg-gray-900 pt-8">
      <SEO 
        title={t('meta.title', 'Contact Us')}
        description={t('meta.description', 'Get in touch with us')}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AutoDealer",
          "name": "Kyaw Kyar Car Showroom",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": t('info.address.line1', '123 Main Road'),
            "addressLocality": "Yangon",
            "addressCountry": "MM"
          },
          "telephone": t('info.phone.mobile', '+95-9-123-456-789'),
          "email": t('info.email.general', 'info@kyawkyar.com')
        }}
      />
      <ContactComponent />
    </div>
  );
};

export default Contact;