import React from "react";
import { useTranslation } from "react-i18next";
import SEO from "../components/SEO";
import PremiumPayment from "../components/PremiumPayment";

const Payments: React.FC = () => {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language.startsWith("mm") ? "my" : "en";

  return (
    <main className="bg-[#f8fafc] min-h-screen py-2 lg:py-3">
      <SEO
        lang={lang}
        canonical={`/${lang}/payments`}
        title={t("payments_info.meta.title", "Payments | Kyaw Kyar Car Showroom")}
        description={t(
          "payments_info.meta.description",
          "Payment options and installment plans for your car purchase."
        )}
      />
      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3">
        <PremiumPayment />
      </div>
    </main>
  );
};

export default Payments;
