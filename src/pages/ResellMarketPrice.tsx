import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import heroBannerImg from "../assets/resell-hero-showroom.jpg";
import step1Img from "../assets/hero-payment.png";
import step2Img from "../assets/about.jpg";
import step3Img from "../assets/hero-installment.png";
import ScrollToTop from "../components/ScrollToTop";
import SEO from "../components/SEO";

type ProcessStepData = {
  step: string;
  title: string;
  desc: string;
  image: string;
  imageSide: "left" | "right";
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const fadeSide = (from: "left" | "right") => ({
  hidden: { opacity: 0, x: from === "left" ? -40 : 40 },
  visible: { opacity: 1, x: 0 },
});

const ResellMarketPrice: React.FC = () => {
  const { t, i18n } = useTranslation("cars");
  const navigate = useNavigate();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const isMyanmar = lang.startsWith("mm") || lang.startsWith("my");

  const primaryButtonClass =
    "w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-full text-sm tracking-wide hover:bg-blue-700 transition inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200";

  const processSteps: ProcessStepData[] = useMemo(
    () => [
      {
        step: "01",
        title: t("resell_market.process.steps.01.title", "Submit details"),
        desc: t(
          "resell_market.process.steps.01.description",
          "Share your car details and photos so we can understand your car clearly.",
        ),
        image: step1Img,
        imageSide: "left",
      },
      {
        step: "02",
        title: t("resell_market.process.steps.02.title", "Market review"),
        desc: t(
          "resell_market.process.steps.02.description",
          "We review current market listings, demand, and your car condition to estimate a fair price.",
        ),
        image: step2Img,
        imageSide: "right",
      },
      {
        step: "03",
        title: t("resell_market.process.steps.03.title", "Get a suggested price"),
        desc: t(
          "resell_market.process.steps.03.description",
          "We contact you with a market-based price suggestion and the next steps to list your car.",
        ),
        image: step3Img,
        imageSide: "left",
      },
    ],
    [t, lang],
  );

  return (
    <main className={`bg-white text-gray-900 ${isMyanmar ? "font-myanmar" : ""}`}>
      <SEO
        title={t("resell_market_meta.title", "Resell at Market Price")}
        description={t(
          "resell_market_meta.description",
          "Get a market-based valuation and resell your car with a smooth process.",
        )}
        canonical="/resell-market-price"
      />
      <ScrollToTop />

      <section className="relative h-[420px] md:h-[520px]">
        <motion.img
          src={heroBannerImg}
          alt={t("resell_market.title", "Resell at Market Price")}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 h-full flex items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto px-6 text-white"
          >
            <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
              <BadgeCheck className="text-blue-300" />
              <span
                className={`text-xs text-white/80 ${
                  isMyanmar ? "tracking-normal" : "tracking-[0.35em] uppercase"
                }`}
              >
                {t("resell_market.hero_card.kicker", "Resell Market Price")}
              </span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-semibold mb-6 ${
                isMyanmar ? "leading-[1.6]" : "leading-[1.2]"
              } text-center md:text-left`}
            >
              {t("resell_market.title", "Resell at Market Price")}
            </h1>

            <p className="text-white/85 text-base sm:text-lg leading-8 max-w-2xl text-center md:text-left">
              {t(
                "resell_market.subtitle",
                "Share your car details and photos, and we'll suggest a fair market price with clear next steps.",
              )}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center justify-center md:justify-start">
              <button onClick={() => navigate("/sellCars")} className={primaryButtonClass}>
                {t("resell_market.cta.primary", "Continue to Sell Car")}
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-sm text-white/70 leading-6 max-w-lg text-center md:text-left">
                {t("resell_market.note.desc", "We'll guide you step by step.")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className={`text-2xl sm:text-3xl font-semibold text-center mb-12 md:mb-20 ${
              isMyanmar ? "leading-[1.6]" : "leading-[1.2]"
            }`}
          >
            {t("resell_market.process.sectionTitle", "How it works")}
          </motion.h2>

          {processSteps.map((step) => (
            <StepBlock
              key={step.step}
              step={step.step}
              stepLabel={t("resell_market.process.stepLabel", "STEP")}
              title={step.title}
              desc={step.desc}
              image={step.image}
              imageSide={step.imageSide}
            />
          ))}
        </div>
      </section>

      <section className="py-12 md:py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"}`}>
            {t("resell_market.cta_card.title", "Ready to submit your car details?")}
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-8 mb-8 md:mb-10">
            {t(
              "resell_market.cta_card.desc",
              "Continue to the Sell Car page to upload photos and send your information.",
            )}
          </p>

          <button
            onClick={() => navigate("/sellCars")}
            className={`${primaryButtonClass} px-16`}
          >
            {t("resell_market.cta.secondary", "Go to Sell Car")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>
    </main>
  );
};

const StepBlock: React.FC<{
  step: string;
  stepLabel: string;
  title: string;
  desc: string;
  image: string;
  imageSide: "left" | "right";
}> = ({ step, stepLabel, title, desc, image, imageSide }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeSide(imageSide)}
    transition={{ duration: 0.6 }}
    className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-12 md:mb-24 last:mb-0"
  >
    <div className={imageSide === "left" ? "md:order-2" : "md:order-1"}>
      <span className="text-sm font-semibold text-gray-400">
        {stepLabel} {step}
      </span>
      <h3 className="text-xl md:text-2xl font-semibold mt-3 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed max-w-xl">{desc}</p>
    </div>

    <div className={imageSide === "left" ? "md:order-1" : "md:order-2"}>
      <div className="h-[220px] md:h-[340px] rounded-2xl overflow-hidden shadow-md mt-6 md:mt-0 ring-1 ring-black/5">
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </motion.div>
);

export default ResellMarketPrice;
