import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Ban,
    Check,
    CheckCircle2,
    Expand,
    FileCheck2,
    Scale,
    ShieldCheck,
    X,
} from "lucide-react";

import SEO from "../components/SEO";
import cleanHistoryHero from "../assets/cleanhistory.png";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

interface PrincipleCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

interface RuleCardProps {
    number: string;
    title: string;
    description: string;
}

interface PillProps {
    text: string;
}

interface ChecklistLineProps {
    label: string;
}

const ChecklistLine: React.FC<ChecklistLineProps> = ({ label }) => (
    <div className="flex items-start gap-1.5">
        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
        <span className="text-left whitespace-nowrap leading-6">
            <span className="font-semibold text-emerald-600">[Check]</span>{" "}
            <span className="text-slate-800">{label}</span>
        </span>
    </div>
);

const CleanHistory: React.FC = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("cleanHistory");
    const [isInspectionFullscreen, setIsInspectionFullscreen] = useState(false);

    const lang = i18n.resolvedLanguage ?? i18n.language;
    const canonicalLang =
        lang.startsWith("my") || lang.startsWith("mm") ? "my" : "en";
    const isMyanmar = canonicalLang === "my";

    return (
        <main
            className={`overflow-hidden bg-[#E6EEF4] text-slate-950 ${isMyanmar ? "font-myanmar" : ""
                }`}
        >
            <SEO
                lang={canonicalLang}
                canonical={`/${canonicalLang}/why-kyawkyar/clean-history`}
                title={t("meta.title")}
                description={t("meta.description")}
            />

            {/* HERO */}
            <section className="relative isolate overflow-hidden px-6 pb-16 pt-16 md:min-h-[calc(100vh-4.5rem)] md:pb-20 md:pt-20">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,rgba(191,219,254,0.55),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(226,232,240,0.9),transparent_38%),linear-gradient(180deg,#E6EEF4_0%,#dfe8f0_55%,#d4e0ea_100%)]" />
                <div className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgba(100,116,139,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(100,116,139,0.4)_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="absolute left-10 top-24 -z-10 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl md:left-24" />
                <div className="absolute right-8 top-28 -z-10 h-64 w-64 rounded-full bg-slate-200/60 blur-3xl md:right-20" />

                <div className="mx-auto flex max-w-7xl flex-col justify-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        transition={{ duration: 0.6 }}
                        className="relative mx-auto max-w-5xl text-left"
                    >
                        <div className={`inline-flex items-center rounded-full border border-slate-400/25 bg-slate-600/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] backdrop-blur-md ${isMyanmar ? "" : ""}`}>
                            {t("hero.badge")}
                        </div>

                        <h1
                            className={`mt-5 font-semibold tracking-[-0.05em] text-slate-900 ${isMyanmar ? "max-w-4xl text-[2.65rem] leading-[1.35] sm:text-[3.45rem] lg:text-[4.3rem]" : "max-w-4xl text-[3.05rem] leading-[0.92] sm:max-w-5xl sm:text-[4.1rem] lg:text-[5.25rem]"
                                }`}
                        >
                            {t("hero.title")}
                            {t("hero.titleLine2") ? (
                                <>
                                    <br />
                                    {t("hero.titleLine2")}
                                </>
                            ) : null}
                        </h1>

                        <p
                            className={`mt-5 text-base text-slate-600 sm:text-lg ${isMyanmar ? "max-w-4xl leading-[1.9]" : "max-w-4xl leading-8"
                                }`}
                        >
                            {t("hero.description")}
                        </p>

                        <div className="mt-7 flex flex-wrap justify-start gap-3">
                            <MicroPill text={t("guarantee.items.verifiedOwnership")} />
                            <MicroPill text={t("guarantee.items.noHiddenLegal")} />
                            <MicroPill text={t("guarantee.items.transparentHistory")} />
                        </div>

                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        transition={{ duration: 0.7, delay: 0.08 }}
                        className="relative mx-auto mt-12 max-w-6xl"
                    >
                        <div className="absolute left-6 top-14 hidden h-[9rem] w-[10.5rem] rounded-[1.6rem] border border-white/85 bg-white/40 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:block">
                            <div className="h-2.5 w-14 rounded-full bg-slate-300" />
                            <div className="mt-5 space-y-3">
                                <div className="h-2 w-full rounded-full bg-slate-200" />
                                <div className="h-2 w-4/5 rounded-full bg-slate-200" />
                                <div className="h-2 w-3/5 rounded-full bg-slate-200" />
                                <div className="h-2 w-4/6 rounded-full bg-slate-200" />
                            </div>
                            <div className="mt-6 space-y-1 text-[11px] text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                    <span>
                                        <span className="font-medium text-emerald-600">
                                            [Check]
                                        </span>{" "}
                                        {t("inspection.ghost.ownershipTransfer")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                    <span>
                                        <span className="font-medium text-emerald-600">
                                            [Check]
                                        </span>{" "}
                                        {t("inspection.ghost.historyReportClear")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute right-4 top-[4.5rem] hidden w-[9rem] rounded-[1.5rem] border border-white/85 bg-white/40 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-xl lg:right-16 xl:block">
                            <div className="space-y-3">
                                <div className="ml-auto h-2 w-16 rounded-full bg-slate-300" />
                                <div className="ml-auto h-2 w-20 rounded-full bg-slate-200" />
                                <div className="ml-auto h-2 w-14 rounded-full bg-slate-200" />
                            </div>

                            <div className="mt-8 flex justify-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50/95 text-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.15)]">
                                    <Check className="h-7 w-7" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-100/85 blur-3xl" />

                        <button
                            type="button"
                            onClick={() => setIsInspectionFullscreen(true)}
                            className="relative z-10 mx-auto block w-full max-w-[64rem] rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(241,247,252,0.92)_0%,rgba(236,243,249,0.88)_32%,rgba(232,239,246,0.84)_100%)] px-5 pb-5 pt-5 text-left shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur-[15px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_36px_110px_rgba(15,23,42,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 md:rounded-[2.25rem] md:px-10 md:pb-6 md:pt-5"
                            aria-label="Open inspection report fullscreen"
                        >
                            <div className="absolute inset-x-12 top-0 h-16 rounded-b-[1.75rem] bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.16),rgba(255,255,255,0))]" />
                            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.08)_26%,rgba(255,255,255,0)_100%)] md:rounded-[2.25rem]" />
                            <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/55 md:rounded-[2.25rem]" />
                            <div className="absolute right-5 top-5 hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur md:inline-flex">
                                <Expand className="h-3.5 w-3.5" />
                                Full Screen
                            </div>

                            <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <p className="text-lg font-medium tracking-[-0.03em] text-slate-900 md:text-[1.65rem]">
                                    {t("inspection.title")}
                                </p>

                            </div>

                            <div className="relative mt-4 grid gap-5 lg:grid-cols-[minmax(236px,0.42fr)_minmax(0,1fr)_minmax(236px,0.42fr)] lg:items-center lg:gap-x-8">
                                <div className="space-y-2.5 rounded-[1.4rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.66)_0%,rgba(248,250,252,0.56)_100%)] p-4 text-[12px] text-slate-700 shadow-[0_12px_36px_rgba(15,23,42,0.045)] backdrop-blur-md lg:w-full lg:p-3.5">
                                    <ChecklistLine label={t("inspection.checks.cleanTitle")} />
                                    <ChecklistLine label={t("inspection.checks.engine")} />
                                    <ChecklistLine label={t("inspection.checks.singleOwner")} />
                                </div>

                                <div className="relative flex min-h-[210px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(244,248,251,0.92)_100%)] px-3 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] md:min-h-[248px]">
                                    <div className="pointer-events-none absolute bottom-[10%] left-1/2 h-12 w-[62%] max-w-md -translate-x-1/2 rounded-full bg-slate-900/[0.12] blur-2xl" />
                                    <img
                                        src={cleanHistoryHero}
                                        alt={t("hero.alt")}
                                        className="relative z-10 mx-auto h-auto w-full max-w-[26.5rem] object-contain drop-shadow-[0_24px_48px_rgba(15,23,42,0.14)]"
                                        loading="eager"
                                        decoding="async"
                                    />
                                </div>

                                <div className="space-y-2.5 rounded-[1.4rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.66)_0%,rgba(248,250,252,0.56)_100%)] p-4 text-[12px] text-slate-700 shadow-[0_12px_36px_rgba(15,23,42,0.045)] backdrop-blur-md lg:w-full lg:p-3.5">
                                    <ChecklistLine
                                        label={t("inspection.checks.serviceRecords")}
                                    />
                                    <ChecklistLine
                                        label={t("inspection.checks.noMajorAccidents")}
                                    />
                                    <ChecklistLine
                                        label={t("inspection.checks.odometerAccurate")}
                                    />
                                    <ChecklistLine
                                        label={t("inspection.checks.validServiceRecords")}
                                    />
                                </div>
                            </div>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* PRINCIPLES */}
            <section className="px-6 py-14 md:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-4 lg:grid-cols-3">
                        <PrincipleCard
                            icon={<FileCheck2 className="h-5 w-5" />}
                            title={t("trust.verifiedDoc.title")}
                            description={t("trust.verifiedDoc.description")}
                        />
                        <PrincipleCard
                            icon={<Scale className="h-5 w-5" />}
                            title={t("trust.zeroRisk.title")}
                            description={t("trust.zeroRisk.description")}
                        />
                        <PrincipleCard
                            icon={<ShieldCheck className="h-5 w-5" />}
                            title={t("trust.buyerProtection.title")}
                            description={t("trust.buyerProtection.description")}
                        />
                    </div>
                </div>
            </section>

            {/* REJECTION RULES */}
            <section className="px-6 py-14 md:py-20">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={fadeUp}
                        transition={{ duration: 0.55 }}
                        className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end"
                    >
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                                Rejection Rules
                            </p>
                            <h2
                                className={`mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl ${isMyanmar ? "leading-[1.5]" : "leading-tight"
                                    }`}
                            >
                                {t("rejection.sectionTitle")}
                            </h2>
                        </div>

                        <p
                            className={`max-w-2xl text-slate-600 ${isMyanmar ? "leading-[1.9]" : "leading-8"
                                }`}
                        >
                            {t("rejection.sectionDescription")}
                        </p>
                    </motion.div>

                    <div className="mt-10 grid gap-5 lg:grid-cols-3">
                        <RuleCard
                            number="01"
                            title={t("rejection.noOwnerBook.title")}
                            description={t("rejection.noOwnerBook.description")}
                        />
                        <RuleCard
                            number="02"
                            title={t("rejection.noIllegalMods.title")}
                            description={t("rejection.noIllegalMods.description")}
                        />
                        <RuleCard
                            number="03"
                            title={t("rejection.noLegalExposure.title")}
                            description={t("rejection.noLegalExposure.description")}
                        />
                    </div>
                </div>
            </section>

            {/* BUYER OUTCOME */}
            <section className="px-6 py-14 md:py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUp}
                            transition={{ duration: 0.55 }}
                        >
                            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                                Buyer Outcome
                            </p>
                            <h2
                                className={`mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl ${isMyanmar ? "max-w-xl leading-[1.5]" : "leading-tight"
                                    }`}
                            >
                                {t("guarantee.sectionTitle")}
                            </h2>
                            <p
                                className={`mt-5 max-w-xl text-slate-600 ${isMyanmar ? "max-w-xl leading-[1.9]" : "leading-8"
                                    }`}
                            >
                                {t("meta.description")}
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUp}
                            transition={{ duration: 0.55, delay: 0.06 }}
                            className="grid gap-4 self-start sm:grid-cols-2"
                        >
                            <OutcomePill text={t("guarantee.items.verifiedOwnership")} />
                            <OutcomePill text={t("guarantee.items.noHiddenLegal")} />
                            <OutcomePill text={t("guarantee.items.transparentHistory")} />
                            <OutcomePill text={t("guarantee.items.resaleConfidence")} />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="px-6 pb-16 pt-2 md:pb-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={fadeUp}
                    transition={{ duration: 0.55 }}
                    className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-300/70 bg-[linear-gradient(135deg,#ffffff_0%,#faf8f2_100%)] shadow-[0_24px_80px_rgba(15,23,42,0.07)]"
                >
                    <div className="grid gap-10 px-7 py-8 md:px-10 md:py-10 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-500">
                                Final Assurance
                            </p>
                            <h2
                                className={`mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl ${isMyanmar ? "leading-[1.72]" : "leading-tight"
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
                            className="inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            {t("cta.button")}
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            </section>

            {isInspectionFullscreen ? (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-[rgba(226,236,246,0.82)] p-4 backdrop-blur-sm md:p-8">
                    <button
                        type="button"
                        onClick={() => setIsInspectionFullscreen(false)}
                        className="fixed right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/88 px-4 py-2 text-sm font-medium text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition hover:bg-white md:right-8 md:top-8"
                    >
                        <X className="h-4 w-4" />
                        Close
                    </button>

                    <div className="flex min-h-full items-center justify-center">
                        <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(243,248,252,0.98)_0%,rgba(233,241,248,0.95)_100%)] p-5 shadow-[0_32px_100px_rgba(15,23,42,0.18)] md:p-8">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.4),rgba(255,255,255,0))]" />
                            <div className="absolute inset-0 rounded-[2rem] border border-white/70" />
                            <div className="relative z-10">
                                <div className="flex items-start justify-between gap-4 border-b border-white/70 pb-5">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                                            {t("hero.badge")}
                                        </p>
                                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900 md:text-4xl">
                                            {t("inspection.title")}
                                        </h2>
                                    </div>
                                </div>

                                <div className="mt-6 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
                                    <div className="space-y-4">
                                        <FullscreenChecklistCard
                                            title={t("guarantee.sectionTitle")}
                                            items={[
                                                t("guarantee.items.verifiedOwnership"),
                                                t("guarantee.items.noHiddenLegal"),
                                                t("guarantee.items.transparentHistory"),
                                            ]}
                                        />
                                        <FullscreenChecklistCard
                                            title={t("inspection.ghost.ownershipTransfer")}
                                            items={[t("inspection.ghost.historyReportClear")]}
                                        />
                                        <FullscreenChecklistCard
                                            title={t("trust.buyerProtection.title")}
                                            items={[
                                                t("inspection.checks.singleOwner"),
                                                t("inspection.checks.validServiceRecords"),
                                            ]}
                                        />
                                    </div>

                                    <div className="rounded-[1.85rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(246,250,252,0.88)_100%)] p-4 shadow-[0_22px_60px_rgba(15,23,42,0.12)] md:p-6">
                                        <div className="grid gap-5 lg:grid-cols-[minmax(220px,0.42fr)_minmax(0,1fr)_minmax(220px,0.42fr)] lg:items-center">
                                            <div className="space-y-3 rounded-[1.4rem] border border-slate-200/70 bg-white/72 p-4 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                                                <ChecklistLine label={t("inspection.checks.cleanTitle")} />
                                                <ChecklistLine label={t("inspection.checks.engine")} />
                                                <ChecklistLine label={t("inspection.checks.singleOwner")} />
                                                <ChecklistLine
                                                    label={t("inspection.checks.validServiceRecords")}
                                                />
                                            </div>

                                            <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-[1.8rem] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(251,253,255,1)_0%,rgba(241,246,250,0.98)_100%)] px-4 py-6 md:min-h-[360px]">
                                                <div className="pointer-events-none absolute bottom-[10%] left-1/2 h-16 w-[62%] -translate-x-1/2 rounded-full bg-slate-900/[0.12] blur-2xl" />
                                                <img
                                                    src={cleanHistoryHero}
                                                    alt={t("hero.alt")}
                                                    className="relative z-10 mx-auto h-auto w-full max-w-2xl object-contain drop-shadow-[0_24px_48px_rgba(15,23,42,0.14)]"
                                                    loading="eager"
                                                    decoding="async"
                                                />
                                            </div>

                                            <div className="space-y-3 rounded-[1.4rem] border border-slate-200/70 bg-white/72 p-4 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                                                <ChecklistLine
                                                    label={t("inspection.checks.serviceRecords")}
                                                />
                                                <ChecklistLine
                                                    label={t("inspection.checks.noMajorAccidents")}
                                                />
                                                <ChecklistLine
                                                    label={t("inspection.checks.odometerAccurate")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </main>
    );
};

const PrincipleCard: React.FC<PrincipleCardProps> = ({
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
        className="rounded-[1.75rem] border border-slate-200/80 bg-white/82 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.045)] backdrop-blur"
    >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
            {icon}
        </div>
        <h3 className="mt-5 text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-slate-950">
            {title}
        </h3>
        <p className="mt-4 max-w-xs text-base leading-7 text-slate-600">
            {description}
        </p>
    </motion.article>
);

const RuleCard: React.FC<RuleCardProps> = ({ number, title, description }) => (
    <motion.article
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        transition={{ duration: 0.55 }}
        whileHover={{ y: -4 }}
        className="rounded-[1.75rem] border border-slate-200/80 bg-white/82 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.045)] backdrop-blur"
    >
        <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                {number}
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <Ban className="h-4.5 w-4.5" />
            </div>
        </div>

        <h3 className="mt-8 text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] text-slate-950">
            {title}
        </h3>
        <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
    </motion.article>
);

const OutcomePill: React.FC<PillProps> = ({ text }) => (
    <div className="flex items-center gap-3 rounded-[1.2rem] border border-slate-200 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.035)]">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white">
            <Check className="h-3.5 w-3.5" />
        </div>
        <p className="text-sm font-semibold text-slate-900 sm:text-base">{text}</p>
    </div>
);

const MicroPill: React.FC<PillProps> = ({ text }) => (
    <div
        className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/62 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.03)] backdrop-blur-md"
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

interface FullscreenChecklistCardProps {
    title: string;
    items: string[];
}

const FullscreenChecklistCard: React.FC<FullscreenChecklistCardProps> = ({
    title,
    items,
}) => (
    <div className="rounded-[1.4rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82)_0%,rgba(246,250,252,0.72)_100%)] p-4 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <p className="text-sm font-semibold tracking-[-0.02em] text-slate-800">{title}</p>
        <div className="mt-4 space-y-3">
            {items.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                </div>
            ))}
        </div>
    </div>
);

export default CleanHistory;    
