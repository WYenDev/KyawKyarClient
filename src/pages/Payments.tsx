import React from 'react';
import { useTranslation } from 'react-i18next';
import PremiumPayment from '../components/PremiumPayment';
import SEO from '../components/SEO';

const Payments: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <main className="bg-[#f8fafc] min-h-screen py-2 lg:py-3">
      <SEO
        canonical="/payments"
        title={t('payments_info.title', 'Flexible Payment Options') + ' - Kyaw Kyar'}
        description={t(
          'payments_info.description',
          'Cash, showroom installment, or bank financing for your car purchase at Kyaw Kyar.'
        ).replace(/<[^>]*>/g, '')}
      />
      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3">
        <PremiumPayment />
      </div>
    </main>
  );
};

export default Payments;