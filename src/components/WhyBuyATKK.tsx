import React from "react";
import {
  ShieldCheck,
  BadgeCheck,
  Banknote,
  History,
  Zap,
  Contact,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/* ================= Types ================= */
type Benefit = {
  title: string;
  description: string;
  icon: React.ReactNode;
  bg: string;
  type: "detail" | "redirect";
  slug?: string;
  redirectTo?: string;
};

/* ================= Component ================= */
const WhyBuyAtKyawKyar: React.FC = () => {
  const { t, i18n } = useTranslation("home");
  const navigate = useNavigate();

  const isMyanmar = i18n.language.startsWith("mm");

  /* ================= Data ================= */
  const benefits: Benefit[] = [
    {
      title: t("whybuy.benefits.inspection.title"),
      description: t("whybuy.benefits.inspection.description"),
      type: "detail",
      slug: "rigorous-quality-inspection",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      title: t("whybuy.benefits.financing.title"),
      description: t("whybuy.benefits.financing.description"),
      type: "redirect",
      redirectTo: "/payments",
      icon: <Banknote className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      title: t("whybuy.benefits.swift-processing.title"),
      description: t("whybuy.benefits.swift-processing.description"),
      type: "detail",
      slug: "swift-processing",
      icon: <History className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: t("whybuy.benefits.clean-history.title"),
      description: t("whybuy.benefits.clean-history.description"),
      type: "detail",
      slug: "clean-history",
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      title: t("whybuy.benefits.buy-at-market-price.title"),
      description: t("whybuy.benefits.buy-at-market-price.description"),
      type: "redirect",
      redirectTo: "/sellCars", // ✅ FIXED: direct sell car redirect
      icon: <BadgeCheck className="w-6 h-6 text-violet-600" />,
      bg: "bg-violet-50",
    },
    {
      title: t("whybuy.benefits.support.title"),
      description: t("whybuy.benefits.support.description"),
      type: "redirect",
      redirectTo: "/contact",
      icon: <Contact className="w-6 h-6 text-rose-600" />,
      bg: "bg-rose-50",
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
    <section className="min-h-screen flex items-center bg-white py-12 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= Header ================= */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.25em] mb-4">
            The KyawKyar Standard
          </h2>

          <h3
            className={`text-4xl lg:text-5xl font-black text-slate-900 mb-6 ${isMyanmar ? "leading-[1.5]" : "leading-tight"
              }`}
          >
            <span className={isMyanmar ? "text-indigo-600" : ""}>
              {t("whybuy.title_prefix")}
            </span>
            <br />
            <span className={!isMyanmar ? "text-indigo-600" : ""}>
              {t("whybuy.title_suffix")}
            </span>
          </h3>

          <p className="text-slate-600 text-lg">
            {t("whybuy.description")}
          </p>
        </div>

        {/* ================= Cards ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              onClick={() => handleClick(benefit)}
              className="group cursor-pointer bg-white p-5 rounded-xl border border-slate-100
                         shadow-sm hover:shadow-xl hover:-translate-y-1
                         transition-all duration-300"
            >
              <div
                className={`${benefit.bg} w-12 h-12 rounded-xl flex items-center justify-center
                            mb-4 group-hover:scale-110 transition-transform`}
              >
                {benefit.icon}
              </div>

              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {benefit.title}
              </h4>

              <p className="text-slate-500 leading-relaxed text-sm">
                {benefit.description}
              </p>

              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">
                {t("common.learn_more", "Learn more")} →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBuyAtKyawKyar;
