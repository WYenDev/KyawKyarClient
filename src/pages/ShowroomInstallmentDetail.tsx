import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Clock, FileText, ShieldCheck, Landmark, ArrowRight, Sparkles } from "lucide-react";

import heroPaymentImage from "../assets/hero-payment.png";

type Mode = "showroom" | "bank";

const FIXED_BANKS = ["KBZ Bank", "AYA Bank", "CB Bank"] as const;

// ✅ Put a car-only image (NO human / NO money) in /public/images/hero-car.jpg
const IMAGES = {
    heroCar: heroPaymentImage,
};

const InstallmentDetail = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("common");
    const [mode, setMode] = useState<Mode>("showroom");
    const dir = useMemo(() => (mode === "showroom" ? -1 : 1), [mode]);
    const banks = [...FIXED_BANKS, t("installment_detail.banks.other_local")];

    return (
        <section className="bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
            {/* ================= HERO (FIXED, Premium, Car Image, No Human/Money) ================= */}
            <Hero
                mode={mode}
                onCalculate={() => navigate("/payments", { state: { recommendedMode: mode } })}
            />

            {/* ================= TOGGLE ================= */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="flex justify-center mt-12 sm:mt-14 px-6"
            >
                <div className="bg-white/70 backdrop-blur-sm p-1 rounded-2xl flex gap-1 shadow-sm ring-1 ring-black/5">
                    <ToggleButton
                        active={mode === "showroom"}
                        onClick={() => setMode("showroom")}
                        label={t("installment_detail.toggle.showroom")}
                    />
                    <ToggleButton
                        active={mode === "bank"}
                        onClick={() => setMode("bank")}
                        label={t("installment_detail.toggle.bank")}
                    />
                </div>
            </motion.div>

            {/* ================= CONTENT ================= */}
            <div className="mt-12 sm:mt-16 px-6">
                <AnimatePresence mode="wait" custom={dir}>
                    {mode === "showroom" ? (
                        <ShowroomBlock key="showroom" dir={dir} />
                    ) : (
                        <BankBlock key="bank" dir={dir} />
                    )}
                </AnimatePresence>
            </div>

            {/* ================= BANK LIST ================= */}
            <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55 }}
                className="max-w-5xl mx-auto mt-16 px-6"
            >
                <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5 p-6 sm:p-8">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                        <div>
                            <h3 className="text-sm font-bold text-slate-500 uppercase mb-2">
                                {t("installment_detail.banks.title")}
                            </h3>
                            <p className="text-slate-600">
                                {t("installment_detail.banks.description")}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                        {banks.map((bank, i) => (
                            <motion.span
                                key={bank}
                                initial={{ opacity: 0, scale: 0.92 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                                className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold ring-1 ring-black/5"
                            >
                                {bank}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ================= CTA (Premium, No Money Image) ================= */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.75 }}
                className="max-w-6xl mx-auto mt-16 sm:mt-20 px-6 pb-20 sm:pb-28"
            >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900" />
                    <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_15%_20%,white_1px,transparent_1px)] [background-size:18px_18px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 p-6 sm:p-8 md:p-10 text-white"
                    >
                        <div className="max-w-2xl">
                            <h3 className="text-2xl md:text-3xl font-black mb-2">
                                {t("installment_detail.cta.title")}
                            </h3>
                            <p className="text-white/80 leading-7 text-pretty">
                                {t("installment_detail.cta.description_line1")}{" "}
                                {t("installment_detail.cta.description_line2")}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                                <CtaPill text={t("installment_detail.cta.pills.instant")} />
                                <CtaPill text={t("installment_detail.cta.pills.steps")} />
                                <CtaPill text={t("installment_detail.cta.pills.secure")} />
                            </div>
                        </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() =>
                                    navigate("/payments", { state: { recommendedMode: mode } })
                                }
                                className="w-full md:w-auto px-8 py-4 rounded-xl bg-white text-slate-900 font-black text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                            >
                                {t("installment_detail.cta.button")} <ArrowRight className="w-5 h-5" />
                            </motion.button>
                    </motion.div>

                    <motion.div
                        className="pointer-events-none absolute -top-16 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl"
                        animate={{ x: [0, 28, 0], y: [0, 18, 0] }}
                        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div
                        className="pointer-events-none absolute -bottom-20 -right-16 w-80 h-80 rounded-full bg-blue-500/12 blur-3xl"
                        animate={{ x: [0, -22, 0], y: [0, -16, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default InstallmentDetail;

/* ================= HERO COMPONENT ================= */

const Hero = ({
    mode,
    onCalculate,
}: {
    mode: Mode;
    onCalculate: () => void;
}) => {
    const { t, i18n } = useTranslation("common");
    const isMm = i18n.language?.toLowerCase().startsWith("mm");

    return (
        <div className="relative">
            {/* background layers */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[980px] h-[520px] rounded-full bg-blue-600/12 blur-3xl" />
                <div className="absolute top-10 right-[-140px] w-[520px] h-[520px] rounded-full bg-indigo-600/12 blur-3xl" />
                <div className="absolute bottom-[-220px] left-[-160px] w-[640px] h-[640px] rounded-full bg-slate-900/6 blur-3xl" />

                {/* subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.045]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgb(15 23 42) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 23 42) 1px, transparent 1px)",
                        backgroundSize: "52px 52px",
                    }}
                />
            </div>

            <div className="max-w-6xl mx-auto pt-14 sm:pt-16 md:pt-24 px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                    {/* Left copy */}
                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05, duration: 0.55 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm text-slate-700 text-sm font-semibold ring-1 ring-black/5 shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            {t("installment_detail.hero.kicker")}
                        </motion.div>

                        <h1 className={`font-black mt-6 text-slate-900 tracking-tight leading-[1.4] text-pretty ${isMm ? "text-2xl sm:text-3xl lg:text-4xl" : "text-3xl sm:text-4xl lg:text-5xl"}`}>
                            <Trans
                                ns="common"
                                i18nKey="installment_detail.hero.title"
                                components={{
                                    brand: (
                                        <span className="text-blue-600 sm:whitespace-nowrap" />
                                    ),
                                }}
                            />
                        </h1>

                        <p className="text-slate-600 text-base sm:text-lg leading-7 sm:leading-8 mt-5 max-w-xl text-pretty">
                            {t("installment_detail.hero.description")}
                        </p>

                        {/* premium chips */}
                        <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
                            <HeroChip icon={<Clock className="w-4 h-4" />} text={t("installment_detail.hero.chips.fast")} />
                            <HeroChip icon={<ShieldCheck className="w-4 h-4" />} text={t("installment_detail.hero.chips.secure")} />
                            <HeroChip icon={<Sparkles className="w-4 h-4" />} text={t("installment_detail.hero.chips.premium")} />
                        </div>

                        {/* stats */}
                        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl">
                            <StatCard title={t("installment_detail.hero.stats.fast_title")} desc={t("installment_detail.hero.stats.fast_desc")} />
                            <StatCard title={t("installment_detail.hero.stats.secure_title")} desc={t("installment_detail.hero.stats.secure_desc")} />
                            <StatCard title={t("installment_detail.hero.stats.flex_title")} desc={t("installment_detail.hero.stats.flex_desc")} />
                        </div>

                        {/* actions */}
                        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onCalculate}
                                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg hover:shadow-xl transition-shadow inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                            >
                                {t("installment_detail.hero.button")} <ArrowRight className="w-5 h-5" />
                            </motion.button>

                            <div className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white ring-1 ring-black/5 shadow-sm flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <div className="text-sm">
                                    <div className="font-extrabold text-slate-900">{t("installment_detail.hero.selected_mode")}</div>
                                    <div className="text-slate-600">
                                        {mode === "showroom"
                                            ? t("installment_detail.toggle.showroom")
                                            : t("installment_detail.toggle.bank")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right image card */}
                    <motion.div
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-6"
                    >
                        <div className="relative">
                            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-blue-600/30 via-indigo-600/25 to-slate-900/0 blur" />

                            <div className="relative rounded-3xl overflow-hidden ring-1 ring-black/5 shadow-2xl bg-white">
                                <motion.img
                                    src={IMAGES.heroCar}
                                    alt={t("installment_detail.hero.image_alt")}
                                    className="w-full h-[240px] sm:h-[320px] md:h-[440px] object-cover"
                                    initial={{ scale: 1.04 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.12, duration: 0.55 }}
                                    className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5"
                                >
                                    <div className="backdrop-blur-md bg-white/10 border border-white/15 rounded-2xl p-4 sm:p-5 text-white">
                                        <div className="text-sm font-semibold opacity-90">
                                            {t("installment_detail.hero.image_card.subtitle")}
                                        </div>
                                        <div className="mt-1 text-lg sm:text-xl font-black leading-snug">
                                            {t("installment_detail.hero.image_card.title")}
                                        </div>
                                        <div className="mt-2 text-white/80 text-sm leading-6">
                                            {t("installment_detail.hero.image_card.description")}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.55 }}
                                className="absolute -top-3 sm:-top-4 left-4 sm:left-6"
                            >
                                <div className="px-4 py-3 rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
                                    <div className="text-xs font-bold text-slate-500 uppercase">
                                        KYAW KYAR
                                    </div>
                                    <div className="text-sm font-black text-slate-900">
                                        {t("installment_detail.hero.badge_title")}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const HeroChip = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white ring-1 ring-black/5 shadow-sm text-sm font-semibold text-slate-700">
        <span className="text-blue-600">{icon}</span>
        {text}
    </span>
);

/* ================= TOGGLE ================= */

const ToggleButton = ({
    active,
    onClick,
    label,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
}) => (
    <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onClick}
        className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-extrabold transition-all ${active
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-500 hover:text-slate-700"
            }`}
    >
        {label}
    </motion.button>
);

/* ================= VARIANTS ================= */

const blockVariants: Variants = {
    hidden: (dir: number) => ({
        opacity: 0,
        x: dir * 70,
        filter: "blur(6px)",
    }),
    visible: {
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (dir: number) => ({
        opacity: 0,
        x: dir * -55,
        filter: "blur(6px)",
        transition: { duration: 0.45, ease: [0.4, 0, 1, 1] },
    }),
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
};

/* ================= BLOCKS ================= */

const ShowroomBlock = ({ dir }: { dir: number }) => {
    const { t } = useTranslation("common");

    return (
        <motion.div
            custom={dir}
            variants={blockVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-5xl mx-auto"
        >
            <div className="relative border border-slate-100 rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm overflow-hidden bg-white">
                <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-600/10 blur-2xl" />

                <h2 className="text-2xl font-black mb-3 text-slate-900">{t("installment_detail.showroom.title")}</h2>
                <p className="text-slate-600 mb-10 max-w-2xl leading-7">
                    {t("installment_detail.showroom.description")}
                </p>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icon={<Clock className="w-5 h-5" />}
                            title={t("installment_detail.showroom.benefits.fast_simple_title")}
                            desc={t("installment_detail.showroom.benefits.fast_simple_desc")}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icon={<FileText className="w-5 h-5" />}
                            title={t("installment_detail.showroom.benefits.paperwork_title")}
                            desc={t("installment_detail.showroom.benefits.paperwork_desc")}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icon={<ShieldCheck className="w-5 h-5" />}
                            title={t("installment_detail.showroom.benefits.clear_payment_title")}
                            desc={t("installment_detail.showroom.benefits.clear_payment_desc")}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const BankBlock = ({ dir }: { dir: number }) => {
    const { t } = useTranslation("common");

    return (
        <motion.div
            custom={dir}
            variants={blockVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-5xl mx-auto"
        >
            <div className="relative border border-slate-100 rounded-3xl p-6 sm:p-8 md:p-12 shadow-sm overflow-hidden bg-white">
                <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-indigo-600/10 blur-2xl" />

                <h2 className="text-2xl font-black mb-3 text-slate-900">{t("installment_detail.bank.title")}</h2>
                <p className="text-slate-600 mb-10 max-w-2xl leading-7">
                    {t("installment_detail.bank.description")}
                </p>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                    className="space-y-6"
                >
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icon={<Landmark className="w-5 h-5" />}
                            title={t("installment_detail.bank.benefits.accepted_title")}
                            desc={t("installment_detail.bank.benefits.accepted_desc")}
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Benefit
                            icon={<ShieldCheck className="w-5 h-5" />}
                            title={t("installment_detail.bank.benefits.secure_title")}
                            desc={t("installment_detail.bank.benefits.secure_desc")}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

/* ================= UI Bits ================= */

const StatCard = ({ title, desc }: { title: string; desc: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="p-4 sm:p-5 rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
    >
        <div className="text-base font-extrabold text-slate-900">{title}</div>
        <div className="text-sm text-slate-600 mt-1">{desc}</div>
    </motion.div>
);

const CtaPill = ({ text }: { text: string }) => (
    <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm font-semibold">
        {text}
    </span>
);

const Benefit = ({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) => (
    <div className="flex gap-4 items-start">
        <div className="shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center ring-1 ring-black/5">
                {icon}
            </div>
        </div>
        <div>
            <h4 className="font-extrabold text-slate-900">{title}</h4>
            <p className="text-slate-600 text-sm leading-6 mt-1">{desc}</p>
        </div>
    </div>
);
