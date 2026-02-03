import React from "react";
import {
  ShieldCheck,
  Banknote,
  BadgeCheck,
  Zap,
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

  /* ================= Data (4 CARDS) ================= */
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
      redirectTo: "/showroom-installment",
      icon: <Banknote className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      title: t("whybuy.benefits.buy-at-market-price.title"),
      description: t("whybuy.benefits.buy-at-market-price.description"),
      type: "redirect",
      redirectTo: "/sellCars",
      icon: <BadgeCheck className="w-6 h-6 text-violet-600" />,
      bg: "bg-violet-50",
    },
    {
      title: t("whybuy.benefits.clean-history.title"),
      description: t("whybuy.benefits.clean-history.description"),
      type: "detail",
      slug: "clean-history",
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50",
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
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.25em] mb-4">
            The KyawKyar Standard
          </h2>

          <h3
            className={`text-4xl lg:text-5xl font-black text-slate-900 mb-6 ${isMyanmar ? "leading-[1.6]" : "leading-tight"
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
                         min-h-[260px] flex flex-col"
            >
              <div
                className={`${benefit.bg} w-12 h-12 rounded-xl
                            flex items-center justify-center
                            mb-5 group-hover:scale-110
                            transition-transform`}
              >
                {benefit.icon}
              </div>

              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {benefit.title}
              </h4>

              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                {benefit.description}
              </p>

              <span className="mt-auto pt-5 inline-flex items-center gap-1
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
