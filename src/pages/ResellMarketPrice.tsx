import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Camera,
  ChevronDown,
  ClipboardList,
  Search,
  ShieldCheck,
  Star,
  Timer,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import heroBannerImg from "../assets/resell-hero-showroom.jpg";
import promiseImg1 from "../assets/resell-step-1.jpg";
import promiseImg2 from "../assets/resell-step-2.jpg";
import ScrollToTop from "../components/ScrollToTop";
import SEO from "../components/SEO";

type StatItemData = {
  icon: React.ReactNode;
  value: string;
  title: string;
  desc: string;
};

type ProcessCardData = {
  icon: React.ReactNode;
  step: string;
  title: string;
  desc: string;
  accentClass: string;
};

type PromiseBlockData = {
  kicker: string;
  title: string;
  subtitle: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  imageSide: "left" | "right";
};

type FaqItemData = {
  q: string;
  a: string;
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

  const secondaryButtonClass =
    "w-full sm:w-auto px-10 py-4 bg-white/10 text-white rounded-full text-sm tracking-wide hover:bg-white/15 transition inline-flex items-center justify-center gap-2 ring-1 ring-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30";

  const stats: StatItemData[] = useMemo(
    () => [
      {
        icon: <BarChart3 className="w-5 h-5" aria-hidden />,
        value: t("resell_market.stats.items.01.value", "10,000+"),
        title: t("resell_market.stats.items.01.title", "Market checks"),
        desc: t("resell_market.stats.items.01.desc", "Based on real listings and demand signals."),
      },
      {
        icon: <Timer className="w-5 h-5" aria-hidden />,
        value: t("resell_market.stats.items.02.value", "24hrs"),
        title: t("resell_market.stats.items.02.title", "Average response"),
        desc: t("resell_market.stats.items.02.desc", "Get a suggested price and next steps fast."),
      },
      {
        icon: <ShieldCheck className="w-5 h-5" aria-hidden />,
        value: t("resell_market.stats.items.03.value", "100%"),
        title: t("resell_market.stats.items.03.title", "Transparent guidance"),
        desc: t("resell_market.stats.items.03.desc", "Clear steps, no pressure."),
      },
      {
        icon: <Star className="w-5 h-5" aria-hidden />,
        value: t("resell_market.stats.items.04.value", "5★"),
        title: t("resell_market.stats.items.04.title", "Customer rating"),
        desc: t("resell_market.stats.items.04.desc", "Trusted service and support."),
      },
    ],
    [t],
  );

  const processCards: ProcessCardData[] = useMemo(
    () => [
      {
        icon: <ClipboardList className="w-5 h-5" aria-hidden />,
        step: "01",
        title: t("resell_market.simple_process.steps.01.title", "Submit your car details"),
        desc: t(
          "resell_market.simple_process.steps.01.desc",
          "Tell us your model, year, mileage and any key condition notes.",
        ),
        accentClass: "from-blue-600 to-indigo-600",
      },
      {
        icon: <Camera className="w-5 h-5" aria-hidden />,
        step: "02",
        title: t("resell_market.simple_process.steps.02.title", "Share photos & condition"),
        desc: t(
          "resell_market.simple_process.steps.02.desc",
          "Send clear photos so we can understand your car accurately.",
        ),
        accentClass: "from-violet-600 to-fuchsia-600",
      },
      {
        icon: <Search className="w-5 h-5" aria-hidden />,
        step: "03",
        title: t("resell_market.simple_process.steps.03.title", "We compare the market"),
        desc: t(
          "resell_market.simple_process.steps.03.desc",
          "We benchmark against current listings and demand to estimate a fair range.",
        ),
        accentClass: "from-emerald-600 to-teal-600",
      },
      {
        icon: <BadgeCheck className="w-5 h-5" aria-hidden />,
        step: "04",
        title: t("resell_market.simple_process.steps.04.title", "Receive your suggested price"),
        desc: t(
          "resell_market.simple_process.steps.04.desc",
          "We contact you with a market-based suggested price and next steps to list.",
        ),
        accentClass: "from-orange-500 to-amber-500",
      },
    ],
    [t],
  );

  const promiseBlocks: PromiseBlockData[] = useMemo(
    () => [
      {
        kicker: t("resell_market.promise.one.kicker", "OUR PROMISE"),
        title: t("resell_market.promise.one.title", "Market data, fair guidance"),
        subtitle: t(
          "resell_market.promise.one.subtitle",
          "A suggested price based on real comparisons — explained clearly.",
        ),
        bullets: [
          t("resell_market.promise.one.bullets.01", "Market listing comparison"),
          t("resell_market.promise.one.bullets.02", "Condition-based adjustment"),
          t("resell_market.promise.one.bullets.03", "Transparent guidance"),
          t("resell_market.promise.one.bullets.04", "No obligation to sell"),
        ],
        image: promiseImg1,
        imageAlt: t("resell_market.promise.one.image_alt", "Car market valuation support"),
        imageSide: "left",
      },
      {
        kicker: t("resell_market.promise.two.kicker", "SUPPORT"),
        title: t("resell_market.promise.two.title", "Listing help & secure paperwork"),
        subtitle: t(
          "resell_market.promise.two.subtitle",
          "If you proceed, we help you list with confidence and clarity.",
        ),
        bullets: [
          t("resell_market.promise.two.bullets.01", "Showroom & online listing support"),
          t("resell_market.promise.two.bullets.02", "Buyer communication guidance"),
          t("resell_market.promise.two.bullets.03", "Ownership transfer & paperwork help"),
        ],
        image: promiseImg2,
        imageAlt: t("resell_market.promise.two.image_alt", "Secure listing and paperwork support"),
        imageSide: "right",
      },
    ],
    [t],
  );

  const faqItems: FaqItemData[] = useMemo(
    () => [
      {
        q: t("resell_market.faq.items.01.q", "What information do I need to submit?"),
        a: t(
          "resell_market.faq.items.01.a",
          "Your brand/model, year, mileage, license, and clear photos of exterior/interior help us estimate accurately.",
        ),
      },
      {
        q: t("resell_market.faq.items.02.q", "Is the suggested price guaranteed?"),
        a: t(
          "resell_market.faq.items.02.a",
          "It’s a market-based guidance range. Final selling price can vary depending on condition, documents, and buyer demand.",
        ),
      },
      {
        q: t("resell_market.faq.items.03.q", "How long does the process take?"),
        a: t(
          "resell_market.faq.items.03.a",
          "Most price guidance responses are shared within 24 hours after receiving complete details and photos.",
        ),
      },
      {
        q: t("resell_market.faq.items.04.q", "Do I have to sell with Kyaw Kyar?"),
        a: t(
          "resell_market.faq.items.04.a",
          "No. You can use the suggested market price as guidance. If you want, we can help you list and sell smoothly.",
        ),
      },
    ],
    [t],
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

      <section className="relative overflow-hidden">
        <motion.img
          src={heroBannerImg}
          alt={t("resell_market.title", "Resell at Market Price")}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1B48]/85 via-[#0B1B48]/65 to-[#0B1B48]/40" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 pt-16 sm:pt-20 md:pt-24 pb-24 md:pb-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-6 text-white"
          >
            <div className="flex items-center gap-3 mb-7 justify-center md:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-sm">
                <BadgeCheck className="text-blue-200 w-4 h-4" aria-hidden />
                <span className="text-xs text-white/85">
                  {t("resell_market.hero.pill", "Myanmar's Most Trusted Car Showroom")}
                </span>
              </span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 ${
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

              <button onClick={() => navigate("/sellCars")} className={secondaryButtonClass}>
                {t("resell_market.cta.secondary", "Get market price")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-center md:justify-start">
              <AvatarStack />
              <p className="text-sm text-white/75 leading-6 text-center md:text-left">
                {t("resell_market.hero.trust_line", "Join over 1,000 happy sellers this month")}
              </p>
            </div>
          </motion.div>
        </div>

        <svg
          className="absolute bottom-0 left-0 w-full h-[56px] sm:h-[70px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="white"
            d="M0,64L60,69.3C120,75,240,85,360,90.7C480,96,600,96,720,90.7C840,85,960,75,1080,69.3C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((item) => (
              <StatItem key={item.title} {...item} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className={`text-xs text-blue-600 mb-3 ${isMyanmar ? "tracking-normal" : "tracking-[0.35em] uppercase"}`}>
              {t("resell_market.simple_process.kicker", "SIMPLE PROCESS")}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-semibold ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"}`}>
              {t("resell_market.simple_process.title", "Get your market price in 4 steps")}
            </h2>
            <p className="mt-4 text-gray-600 leading-8 max-w-2xl mx-auto">
              {t(
                "resell_market.simple_process.subtitle",
                "From details to suggested price — clear, fair, and fast.",
              )}
            </p>
          </motion.div>

          <div className="mt-12 md:mt-14 grid md:grid-cols-4 gap-6 md:gap-7">
            {processCards.map((card) => (
              <ProcessCard key={card.step} {...card} stepLabel={t("resell_market.process.stepLabel", "STEP")} />
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button onClick={() => navigate("/sellCars")} className={primaryButtonClass}>
              {t("resell_market.cta.primary", "Continue to Sell Car")}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 space-y-12 md:space-y-16">
          {promiseBlocks.map((block) => (
            <PromiseBlock key={block.title} {...block} />
          ))}
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className={`text-xs text-blue-600 mb-3 ${isMyanmar ? "tracking-normal" : "tracking-[0.35em] uppercase"}`}>
              {t("resell_market.faq.kicker", "FAQ")}
            </p>
            <h2 className={`text-3xl sm:text-4xl font-semibold ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"}`}>
              {t("resell_market.faq.title", "Frequently asked questions")}
            </h2>
          </motion.div>

          <div className="mt-10 space-y-4">
            {faqItems.map((item) => (
              <FaqItem key={item.q} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto px-6"
        >
          <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-700 text-white">
            <div className="px-7 sm:px-10 py-12 sm:py-14 text-center">
              <h2 className={`text-3xl sm:text-4xl font-semibold mb-4 ${isMyanmar ? "leading-[1.6]" : "leading-[1.2]"}`}>
                {t("resell_market.final_cta.title", "Ready to get your resell market price?")}
              </h2>
              <p className="text-white/85 text-base sm:text-lg leading-8 max-w-2xl mx-auto">
                {t(
                  "resell_market.final_cta.subtitle",
                  "Submit your details and photos. We’ll reply with a market-based suggested price and clear next steps.",
                )}
              </p>

              <div className="mt-9 flex justify-center">
                <button onClick={() => navigate("/sellCars")} className="px-12 py-4 rounded-full bg-white text-blue-800 font-semibold inline-flex items-center gap-2 hover:bg-white/95 transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40">
                  {t("resell_market.cta.primary", "Continue to Sell Car")}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <p className="mt-6 text-sm text-white/75">
                {t("resell_market.final_cta.micro", "Market-based • Transparent • Fast response")}
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

const AvatarStack: React.FC = () => (
  <div className="flex items-center justify-center md:justify-start">
    <div className="flex -space-x-2">
      {[
        { label: "U", className: "bg-sky-400" },
        { label: "A", className: "bg-fuchsia-400" },
        { label: "M", className: "bg-rose-400" },
        { label: "K", className: "bg-amber-400" },
      ].map((item) => (
        <span
          key={item.label}
          className={`w-9 h-9 rounded-full ring-2 ring-white/25 text-white text-xs font-semibold flex items-center justify-center ${item.className}`}
          aria-hidden
        >
          {item.label}
        </span>
      ))}
    </div>
  </div>
);

const StatItem: React.FC<StatItemData> = ({ icon, value, title, desc }) => (
  <div className="text-center">
    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 mx-auto flex items-center justify-center ring-1 ring-black/5">
      {icon}
    </div>
    <div className="mt-4 text-2xl sm:text-3xl font-semibold text-blue-700">{value}</div>
    <div className="mt-1 text-sm font-semibold text-gray-900">{title}</div>
    <div className="mt-1 text-xs text-gray-500 leading-5 max-w-[14rem] mx-auto">{desc}</div>
  </div>
);

const ProcessCard: React.FC<ProcessCardData & { stepLabel: string }> = ({
  icon,
  step,
  stepLabel,
  title,
  desc,
  accentClass,
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={fadeUp}
    transition={{ duration: 0.55 }}
    className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5 p-7"
  >
    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${accentClass} text-white flex items-center justify-center`}>
      {icon}
    </div>
    <div className="mt-5 text-xs text-gray-400 tracking-[0.3em] uppercase">
      {stepLabel} {step}
    </div>
    <h3 className="mt-3 text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-3 text-sm text-gray-600 leading-6">{desc}</p>
  </motion.div>
);

const PromiseBlock: React.FC<PromiseBlockData> = ({
  kicker,
  title,
  subtitle,
  bullets,
  image,
  imageAlt,
  imageSide,
}) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
    variants={fadeSide(imageSide)}
    transition={{ duration: 0.6 }}
    className="grid md:grid-cols-2 gap-10 md:gap-14 items-center"
  >
    <div className={imageSide === "left" ? "md:order-1" : "md:order-2"}>
      <div className="rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/5 bg-gray-100">
        <img src={image} alt={imageAlt} loading="lazy" decoding="async" className="w-full h-[260px] md:h-[360px] object-cover" />
      </div>
    </div>

    <div className={imageSide === "left" ? "md:order-2" : "md:order-1"}>
      <p className="text-xs text-blue-600 tracking-[0.35em] uppercase mb-3">{kicker}</p>
      <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 leading-[1.25]">{title}</h3>
      <p className="mt-4 text-gray-600 leading-8">{subtitle}</p>

      <ul className="mt-7 space-y-3">
        {bullets.map((line) => (
          <li key={line} className="flex items-start gap-3">
            <BadgeCheck className="w-5 h-5 text-emerald-600 mt-0.5" aria-hidden />
            <span className="text-sm text-gray-700 leading-6">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const FaqItem: React.FC<FaqItemData> = ({ q, a }) => (
  <details className="group rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6">
    <summary className="cursor-pointer list-none flex items-start justify-between gap-6">
      <div className="text-base font-semibold text-gray-900 leading-7">{q}</div>
      <span className="shrink-0 text-gray-400 group-open:rotate-180 transition-transform mt-1" aria-hidden>
        <ChevronDown className="w-5 h-5" />
      </span>
    </summary>
    <div className="mt-4 text-sm text-gray-600 leading-7">{a}</div>
  </details>
);

export default ResellMarketPrice;
