import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Ban,
    Check,
    CheckCircle2,
    FileCheck2,
    Scale,
    ShieldCheck,
} from "lucide-react";

import SEO from "../components/SEO";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

interface PrincipleCardProps {
    isMyanmar?: boolean;
    icon: ReactNode;
    title: string;
    description: string;
}

interface RuleCardProps {
    icon: ReactNode;
    iconClassName?: string;
    title: string;
    description: string;
}

interface PillProps {
    text: string;
}

const CleanHistory: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("cleanHistory");

    const lang = i18n.resolvedLanguage ?? i18n.language;
    const canonicalLang =
        lang.startsWith("my") || lang.startsWith("mm") ? "my" : "en";
    const isMyanmar = canonicalLang === "my";

    return (
        <main className={`overflow-hidden bg-white text-slate-950 ${isMyanmar ? "font-myanmar" : ""}`}>
            <SEO
                lang={canonicalLang}
                canonical={`/${canonicalLang}/why-kyawkyar/clean-history`}
                title={t("meta.title")}
                description={t("meta.description")}
            />

            {/* HEADER */}
            <section className="bg-white px-6 py-14 md:py-20">
                <div className="mx-auto max-w-6xl">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        transition={{ duration: 0.6 }}
                        className="max-w-5xl"
                    >
                        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gray-500">
                            Why Kyaw Kyar
                        </p>
                        <h1 className={`font-semibold text-gray-900 ${isMyanmar ? "text-[2.3rem] leading-[1.45] sm:text-[2.9rem]" : "text-[2.45rem] leading-[1.1] sm:text-[3.6rem]"}`}>
                            {t("hero.title")}
                            {t("hero.titleLine2") ? (
                                <>
                                    <br />
                                    {t("hero.titleLine2")}
                                </>
                            ) : null}
                        </h1>
                        <p className={`mt-6 max-w-4xl text-base text-gray-600 md:text-lg ${isMyanmar ? "leading-[1.9]" : "leading-relaxed"}`}>
                            {t("hero.description")}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <MicroPill text={t("guarantee.items.verifiedOwnership")} />
                            <MicroPill text={t("guarantee.items.noHiddenLegal")} />
                            <MicroPill text={t("guarantee.items.transparentHistory")} />
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* PRINCIPLES */}
            <section className="bg-gray-50 px-6 py-14 md:py-20">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={fadeUp}
                        transition={{ duration: 0.55 }}
                        className="block"
                    >
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                                {t("trust.sectionLabel")}
                            </p>
                            <h2
                                className={`mt-4 font-semibold tracking-[-0.03em] text-slate-950 ${isMyanmar ? "text-[1.35rem] leading-[1.55] sm:text-[1.6rem]" : "text-[1.65rem] leading-tight sm:text-[1.9rem]"
                                    }`}
                            >
                                {t("trust.sectionTitle")}
                            </h2>
                        </div>

                    </motion.div>

                    <div className="mt-10 grid gap-4 lg:grid-cols-3">
                        <PrincipleCard
                            isMyanmar={isMyanmar}
                            icon={<FileCheck2 className="h-5 w-5" />}
                            title={t("trust.verifiedDoc.title")}
                            description={t("trust.verifiedDoc.description")}
                        />
                        <PrincipleCard
                            isMyanmar={isMyanmar}
                            icon={<Scale className="h-5 w-5" />}
                            title={t("trust.zeroRisk.title")}
                            description={t("trust.zeroRisk.description")}
                        />
                        <PrincipleCard
                            isMyanmar={isMyanmar}
                            icon={<ShieldCheck className="h-5 w-5" />}
                            title={t("trust.buyerProtection.title")}
                            description={t("trust.buyerProtection.description")}
                        />
                    </div>
                </div>
            </section>

            {/* REJECTION RULES */}
            <section className="bg-white px-6 py-14 md:py-20">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={fadeUp}
                        transition={{ duration: 0.55 }}
                        className="block"
                    >
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                                Rejection Rules
                            </p>
                            <h2
                                className={`mt-4 font-semibold tracking-[-0.03em] text-slate-950 ${isMyanmar ? "text-[1.35rem] leading-[1.55] sm:text-[1.6rem]" : "text-[1.65rem] leading-tight sm:text-[1.9rem]"
                                    }`}
                            >
                                {t("rejection.sectionTitle")}
                            </h2>
                        </div>

                    </motion.div>

                    <div className="mt-10 grid gap-5 lg:grid-cols-3">
                        <RuleCard
                            isMyanmar={isMyanmar}
                            icon={<Ban className="h-5 w-5" />}
                            iconClassName="bg-rose-50 text-rose-600"
                            title={t("rejection.noOwnerBook.title")}
                            description={t("rejection.noOwnerBook.description")}
                        />
                        <RuleCard
                            isMyanmar={isMyanmar}
                            icon={<Ban className="h-5 w-5" />}
                            iconClassName="bg-rose-50 text-rose-600"
                            title={t("rejection.noIllegalMods.title")}
                            description={t("rejection.noIllegalMods.description")}
                        />
                        <RuleCard
                            isMyanmar={isMyanmar}
                            icon={<Ban className="h-5 w-5" />}
                            iconClassName="bg-rose-50 text-rose-600"
                            title={t("rejection.noLegalExposure.title")}
                            description={t("rejection.noLegalExposure.description")}
                        />
                    </div>
                </div>
            </section>

            {/* BUYER OUTCOME */}
            <section className="bg-gray-50 px-6 py-14 md:py-20">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={fadeUp}
                        transition={{ duration: 0.55 }}
                        className="block"
                    >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                            Buyer Outcome
                        </p>
                        <h2
                            className={`mt-4 font-semibold tracking-[-0.03em] text-slate-950 ${isMyanmar ? "text-[1.35rem] leading-[1.55] sm:text-[1.6rem]" : "text-[1.65rem] leading-tight sm:text-[1.9rem]"
                                }`}
                        >
                            {t("guarantee.sectionTitle")}
                        </h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={fadeUp}
                        transition={{ duration: 0.55, delay: 0.06 }}
                        className="mt-10 grid gap-4 sm:grid-cols-2"
                    >
                        <OutcomePill text={t("guarantee.items.verifiedOwnership")} />
                        <OutcomePill text={t("guarantee.items.noHiddenLegal")} />
                        <OutcomePill text={t("guarantee.items.transparentHistory")} />
                        <OutcomePill text={t("guarantee.items.resaleConfidence")} />
                    </motion.div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="bg-white px-6 pb-16 pt-4 md:pb-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={fadeUp}
                    transition={{ duration: 0.55 }}
                    className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                >
                    <div className="grid gap-10 px-7 py-8 md:px-10 md:py-10 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                                Final Assurance
                            </p>
                            <h2
                                className={`mt-4 max-w-3xl font-semibold tracking-[-0.03em] text-slate-950 ${isMyanmar ? "text-[1.25rem] leading-[1.68] sm:text-[1.45rem] lg:text-[1.6rem]" : "text-3xl leading-tight sm:text-4xl"
                                    }`}
                            >
                                {t("cta.finalTitle")}
                            </h2>

                            <div className="mt-6 space-y-4">
                                <GuaranteeLine text={t("trust.verifiedDoc.description")} />
                                <GuaranteeLine text={t("trust.zeroRisk.description")} />
                                <GuaranteeLine text={t("trust.buyerProtection.description")} />
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/buyCars")}
                            className="inline-flex items-center justify-center gap-3 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            {t("cta.button")}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            </section>

        </main>
    );
};

const PrincipleCard: React.FC<PrincipleCardProps> = ({
    isMyanmar = false,
    icon,
    title,
    description,
}) => (
    <motion.article
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        transition={{ duration: 0.55 }}
        className="rounded-2xl border border-gray-200 bg-white p-6"
    >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            {icon}
        </div>
        <h3 className={`mt-5 font-semibold text-slate-950 ${isMyanmar ? "text-[1.15rem] leading-[1.55] sm:text-[1.25rem]" : "text-[1.45rem] leading-tight sm:text-[1.6rem]"}`}>
            {title}
        </h3>
        <p className="mt-4 max-w-xs text-base leading-7 text-slate-600">
            {description}
        </p>
    </motion.article>
);

const RuleCard: React.FC<RuleCardProps & { isMyanmar?: boolean }> = ({
    isMyanmar = false,
    icon,
    iconClassName = "bg-rose-50 text-rose-600",
    title,
    description,
}) => (
    <motion.article
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        transition={{ duration: 0.55 }}
        className="rounded-2xl border border-gray-200 bg-white p-6"
    >
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconClassName}`}>
            {icon}
        </div>

        <h3 className={`mt-8 font-semibold text-slate-950 ${isMyanmar ? "text-[1.15rem] leading-[1.55] sm:text-[1.25rem]" : "text-[1.45rem] leading-tight sm:text-[1.6rem]"}`}>
            {title}
        </h3>
        <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </motion.article>
);

const OutcomePill: React.FC<PillProps> = ({ text }) => (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white">
            <Check className="h-3.5 w-3.5" />
        </div>
        <p className="text-sm font-semibold text-slate-900 sm:text-base">{text}</p>
    </div>
);

const MicroPill: React.FC<PillProps> = ({ text }) => (
    <div
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-slate-700"
    >
        <Check className="h-4 w-4 text-emerald-600" />
        <span>{text}</span>
    </div>
);

const GuaranteeLine: React.FC<PillProps> = ({ text }) => (
    <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" />
        <p className="text-base leading-7 text-slate-700">{text}</p>
    </div>
);

export default CleanHistory;    
