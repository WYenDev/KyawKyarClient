import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/* ================= Types ================= */
type Benefit = {
  title: string;
  description: string;
  type: "detail" | "redirect";
  slug?: string;
  redirectTo?: string;
};

/* ================= Component ================= */
const WhyBuyAtKyawKyar: React.FC = () => {
  const { t, i18n } = useTranslation("home");
  const navigate = useNavigate();

  const isMyanmar = i18n.language.startsWith("mm");

  /* ================= Data (4 CARDS) ================= */
  const benefits: Benefit[] = [
    {
      title: t("whybuy.benefits.inspection.title"),
      description: t("whybuy.benefits.inspection.description"),
      type: "detail",
      slug: "rigorous-quality-inspection",
    },
    {
      title: t("whybuy.benefits.financing.title"),
      description: t("whybuy.benefits.financing.description"),
      type: "redirect",
      redirectTo: "/showroom-installment",
    },
    {
      title: t("whybuy.benefits.buy-at-market-price.title"),
      description: t("whybuy.benefits.buy-at-market-price.description"),
      type: "redirect",
      redirectTo: "/sellCars",
    },
    {
      title: t("whybuy.benefits.clean-history.title"),
      description: t("whybuy.benefits.clean-history.description"),
      type: "detail",
      slug: "clean-history",
    },
  ];

  /* ================= Handlers ================= */
  const handleClick = (benefit: Benefit) => {
    if (benefit.type === "redirect" && benefit.redirectTo) {
      navigate(benefit.redirectTo);
      return;
    }

    if (benefit.type === "detail" && benefit.slug) {
      navigate(`/why-kyawkyar/${benefit.slug}`);
    }
  };

  /* ================= Render ================= */
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= Header ================= */}

        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className={`text-sm font-bold text-indigo-600 uppercase tracking-[0.25em] mb-8 ${isMyanmar ? "font-myanmar" : ""}`}>
            {t("whybuy.subtitle")}
          </h2>

          <h3
            className={`text-3xl lg:text-5xl font-black text-slate-900 mb-10 whitespace-nowrap ${isMyanmar ? "font-myanmar leading-[1.6] max-sm:text-[1.8rem] max-sm:whitespace-normal" : "leading-[1.4]"
              }`}
          >
            <span className={isMyanmar ? "text-[0.85em] lg:text-[0.72em]" : ""}>
              {t("whybuy.title_prefix")}
            </span>
            <span className="inline-block pt-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {" "}{t("whybuy.title_highlight")}
            </span>
            <span className={isMyanmar ? "text-[0.85em] lg:text-[0.72em]" : ""}>
              {t("whybuy.title_suffix")}
            </span>
          </h3>

          <p className={`text-slate-600 text-base sm:text-lg leading-relaxed ${isMyanmar ? "font-myanmar" : ""} text-left sm:text-center`}>
            {t("whybuy.description")}
          </p>
        </div>

        {/* ================= Cards (2 x 2) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              onClick={() => handleClick(benefit)}
              className="group cursor-pointer bg-white
                         p-7 rounded-2xl border border-slate-100
                         shadow-sm hover:shadow-xl
                         hover:-translate-y-1
                         transition-all duration-300
                         flex flex-col"
            >
              <h4 className={`text-lg font-bold text-slate-900 mb-5 ${isMyanmar ? "font-myanmar" : ""}`}>
                {benefit.title}
              </h4>

              <p className={`text-slate-500 text-sm leading-relaxed line-clamp-3 ${isMyanmar ? "font-myanmar" : ""}`}>
                {benefit.description}
              </p>

              <span className="mt-8 inline-flex items-center gap-1
                               text-sm font-semibold text-indigo-600">
                Details
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBuyAtKyawKyar;
