import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

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
    <section className="bg-transparent py-2 lg:py-3 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-50/50 blur-[120px] -z-10" />

      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3">
        <div className="bg-white rounded-none p-3 sm:p-7 lg:p-12 shadow-2xl shadow-slate-200/40 border border-white relative overflow-hidden">
          
          {/* ================= Header ================= */}
          <div className="text-center max-w-4xl mx-auto mb-8 relative z-10">
            <h2 className={`text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4 ${isMyanmar ? "font-myanmar" : ""}`}>
              {t("whybuy.subtitle")}
            </h2>

            <h3
              className={`text-2xl lg:text-4xl font-black text-slate-900 mb-6 whitespace-nowrap ${isMyanmar ? "font-myanmar leading-[1.6] max-sm:text-[1.8rem] max-sm:whitespace-normal" : "leading-[1.4]"
                }`}
            >
              <span className={isMyanmar ? "text-[0.85em] lg:text-[0.8em]" : ""}>
                {t("whybuy.title_prefix")}
              </span>
              <span className="inline-block pt-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 whitespace-nowrap">
                {" "}{t("whybuy.title_highlight")}
              </span>
              <span className={isMyanmar ? "text-[0.85em] lg:text-[0.8em] block sm:inline whitespace-nowrap font-myanmar" : ""}>
                {t("whybuy.title_suffix")}
              </span>
            </h3>

          </div>

          {/* ================= Cards (2 x 2) ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                onClick={() => handleClick(benefit)}
                className="group cursor-pointer bg-slate-50/50
                           p-5 sm:p-6 rounded-none border border-slate-100
                           shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50
                           transition-all duration-500 hover:-translate-y-2
                           flex flex-col"
              >
                <h4 className={`text-lg sm:text-xl font-black text-slate-900 mb-3 leading-tight ${isMyanmar ? "font-myanmar" : ""}`}>
                  {benefit.title}
                </h4>

                <p className={`text-slate-500 leading-relaxed ${isMyanmar ? "font-myanmar text-sm leading-6" : "text-base"}`}>
                  {benefit.description}
                </p>

                <div className="mt-4 flex items-center text-indigo-600 font-bold group-hover:gap-4 gap-2 transition-all">
                  <span className="text-sm uppercase tracking-widest font-black">Learn More</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBuyAtKyawKyar;
