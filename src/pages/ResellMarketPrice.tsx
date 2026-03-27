import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, TrendingUp, ClipboardCheck, FileCheck, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


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
  const { t, i18n } = useTranslation("resellMarketPrice");
  const navigate = useNavigate();
  const lang = i18n.resolvedLanguage ?? i18n.language;
  const isMyanmar = lang.startsWith("mm") || lang.startsWith("my");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const primaryButtonClass =
    "w-full sm:w-auto px-10 py-4 bg-blue-600 text-white rounded-full text-sm tracking-wide hover:bg-blue-700 transition inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200";

  const processSteps: ProcessStepData[] = useMemo(
    () => [
      {
        step: "01",
        title: t("process.steps.01.title", "Submit details"),
        desc: t(
          "process.steps.01.description",
          "Share your car details and photos so we can understand your car clearly.",
        ),
        image: step1Img,
        imageSide: "left",
      },
      {
        step: "02",
        title: t("process.steps.02.title", "Market review"),
        desc: t(
          "process.steps.02.description",
          "We review current market listings, demand, and your car condition to estimate a fair price.",
        ),
        image: step2Img,
        imageSide: "right",
      },
      {
        step: "03",
        title: t("process.steps.03.title", "Get a suggested price"),
        desc: t(
          "process.steps.03.description",
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
        title={t("meta.title", "Resell at Market Price")}
        description={t(
          "meta.description",
          "Get a market-based valuation and resell your car with a smooth process.",
        )}
        canonical={`/${lang}/why-kyawkyar/resell-market-price`}
      />
      <ScrollToTop />

      {/* ================= Header ================= */}
      <section className="py-14 md:py-20 bg-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto px-6"
        >
          <p className="uppercase tracking-[0.35em] text-xs text-gray-500 mb-4 text-center md:text-left">
            Why Kyaw Kyar
          </p>
          <h1
            className={`text-3xl sm:text-4xl font-semibold mb-6 ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"
              } text-center md:text-left`}
          >
            {t("title", "Resell at Market Price")}
          </h1>
          <p className={`text-gray-600 text-base md:text-lg leading-relaxed ${isMyanmar ? "leading-[1.9]" : ""} max-w-4xl text-center md:text-left`}>
            {t(
              "description"
            )}
          </p>

        </motion.div>
      </section>

      {/* ================= Kyaw Kyar Standard (Valuation Criteria) ================= */}
      <section className="py-12 md:py-16 bg-gray-50">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto px-6"
        >
          <h2 className={`text-2xl sm:text-3xl font-semibold text-center mb-10 md:mb-12 ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"}`}>
            {t("kyaw_kyar_standard.sectionTitle", "The Kyaw Kyar Standard")}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 ring-1 ring-black/5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{t("kyaw_kyar_standard.marketData.title", "Market Data Analysis")}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {t("kyaw_kyar_standard.marketData.desc", "We use real-time data from across the country to ensure your price reflects current demand.")}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 ring-1 ring-black/5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{t("kyaw_kyar_standard.physicalAppraisal.title", "Physical Appraisal")}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {t("kyaw_kyar_standard.physicalAppraisal.desc", "Our expert technicians conduct a thorough point-by-point inspection to value your car's true condition.")}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 ring-1 ring-black/5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{t("kyaw_kyar_standard.serviceHistory.title", "Service History Premium")}</h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {t("kyaw_kyar_standard.serviceHistory.desc", "Cars with a consistent Kyaw Kyar service history receive the best possible market valuation.")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-12 md:py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className={`text-2xl sm:text-3xl font-semibold text-center mb-12 md:mb-20 ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"
              }`}
          >
            {t("process.sectionTitle", "How it works")}
          </motion.h2>

          {processSteps.map((step) => (
            <StepBlock
              key={step.step}
              step={step.step}
              stepLabel={t("process.stepLabel", "STEP")}
              title={step.title}
              desc={step.desc}
              image={step.image}
              imageSide={step.imageSide}
            />
          ))}
        </div>
      </section>

      {/* ================= Eligibility & Requirements ================= */}
      <section className="py-12 md:py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className={`text-2xl sm:text-3xl font-semibold text-center mb-10 ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"}`}>
            {t("eligibility.sectionTitle", "Eligibility & Requirements")}
          </h2>

          <div className="bg-white rounded-2xl p-8 md:p-10 ring-1 ring-black/5">
            <div className="grid md:grid-cols-3 gap-8 md:gap-10">
              <div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">{t("eligibility.originalPurchase.title", "Original Purchase")}</h3>
                <p className="text-gray-800 leading-relaxed font-medium text-sm">
                  {t("eligibility.originalPurchase.desc", "This benefit is exclusive to vehicles originally purchased from Kyaw Kyar Showrooms.")}
                </p>
              </div>

              <div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">{t("eligibility.maintenanceRecords.title", "Maintenance Records")}</h3>
                <p className="text-gray-800 leading-relaxed font-medium text-sm">
                  {t("eligibility.maintenanceRecords.desc", "The vehicle should have a verifiable maintenance history.")}
                </p>
              </div>

              <div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">{t("eligibility.legalClearance.title", "Legal Clearance")}</h3>
                <p className="text-gray-800 leading-relaxed font-medium text-sm">
                  {t("eligibility.legalClearance.desc", "All registration and ownership documents must be clear and up-to-date.")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="py-12 md:py-16 bg-gray-50">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto px-6"
        >
          <h2 className={`text-2xl sm:text-3xl font-semibold text-center mb-10 ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"}`}>
            {t("faq.sectionTitle", "Frequently Asked Questions")}
          </h2>

          <div className="space-y-4">
            <FAQItem
              isMyanmar={isMyanmar}
              isOpen={openFaq === 0}
              onToggle={() => setOpenFaq(openFaq === 0 ? null : 0)}
              question={t("faq.q1.question", "How long does the appraisal take?")}
              answer={t("faq.q1.answer", "Usually within 24–48 hours. We work quickly to give you a price suggestion as soon as possible.")}
            />
            <FAQItem
              isMyanmar={isMyanmar}
              isOpen={openFaq === 1}
              onToggle={() => setOpenFaq(openFaq === 1 ? null : 1)}
              question={t("faq.q2.question", "Do I have to buy another car from you?")}
              answer={t("faq.q2.answer", "No, this is a standalone buy-back guarantee for your convenience. You can sell without purchasing.")}
            />
            <FAQItem
              isMyanmar={isMyanmar}
              isOpen={openFaq === 2}
              onToggle={() => setOpenFaq(openFaq === 2 ? null : 2)}
              question={t("faq.q3.question", "What if my car has minor damage?")}
              answer={t("faq.q3.answer", "We still offer buy-backs! We simply adjust the market value based on necessary repairs.")}
            />
          </div>
        </motion.div>
      </section>

      <section className="py-12 md:py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 ring-1 ring-black/5">
            <h2 className={`text-2xl sm:text-3xl font-semibold mb-6 ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"}`}>
              {t("cta_card.title", "Ready to submit your car details?")}
            </h2>

            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed font-medium mb-8 md:mb-10">
              {t(
                "cta_card.desc",
                "Continue to the Sell Car page to upload photos and send your information.",
              )}
            </p>

            <button
              onClick={() => navigate("/sellCars")}
              className={`${primaryButtonClass} px-16`}
            >
              {t("cta.secondary", "Go to Sell Car")}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
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
      <p className="text-gray-800 md:text-lg leading-relaxed font-medium max-w-xl">{desc}</p>
    </div>

    <div className={imageSide === "left" ? "md:order-1" : "md:order-2"}>
      <div className="h-[200px] md:h-[320px] rounded-2xl overflow-hidden shadow-md mt-6 md:mt-0 ring-1 ring-black/5">
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

const FAQItem: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  question: string;
  answer: string;
  isMyanmar?: boolean;
}> = ({ isOpen, onToggle, question, answer, isMyanmar }) => (
  <div className={`bg-white rounded-xl ring-1 ring-black/5 overflow-hidden transition-all duration-200 ${isOpen ? 'ring-2 ring-blue-100' : ''}`}>
    <button
      onClick={onToggle}
      className={`w-full px-6 py-5 flex items-center justify-between text-left transition-colors ${isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
    >
      <span className={`font-semibold pr-4 transition-colors ${isOpen ? 'text-blue-700' : 'text-gray-900'}`}>{question}</span>
      <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className={`px-6 pb-5 ${isMyanmar ? 'py-4' : ''}`}>
        <p className={`text-gray-800 font-medium ${isMyanmar ? 'leading-[1.9] text-base' : 'leading-relaxed'}`}>{answer}</p>
      </div>
    </div>
  </div>
);

export default ResellMarketPrice;
