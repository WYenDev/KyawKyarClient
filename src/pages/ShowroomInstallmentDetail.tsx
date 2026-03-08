import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Clock, FileText, ShieldCheck, Landmark, ArrowRight, CheckCircle2 } from "lucide-react";

type Mode = "showroom" | "bank";

const FIXED_BANKS = ["KBZ Bank", "AYA Bank", "CB Bank"] as const;

const InstallmentDetail = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("common");
    const [mode, setMode] = useState<Mode>("showroom");
    const dir = useMemo(() => (mode === "showroom" ? -1 : 1), [mode]);
    const banks = [...FIXED_BANKS, t("installment_detail.banks.other_local")];

    return (
        <section className="bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
            {/* ================= HERO ================= */}
            <Hero
                mode={mode}
                onCalculate={() => navigate("/payments", { state: { recommendedMode: mode } })}
            />

            {/* ================= TOGGLE ================= */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="flex justify-center mt-12 sm:mt-14 px-6 border-t border-gray-100 pt-12"
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

            {/* ================= CTA ================= */}
            <section className="py-12 md:py-16 border-t border-gray-100">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: { opacity: 0, y: 24 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto px-6 text-center"
                >
                    <div className="bg-gray-50 rounded-2xl p-8 md:p-12 ring-1 ring-black/5">
                        <h2 className="text-3xl font-semibold leading-[1.45] mb-6">
                            {t("installment_detail.cta.title")}
                        </h2>

                        <p className="text-gray-700 text-lg sm:text-xl leading-relaxed font-medium mb-8 md:mb-10">
                            {t("installment_detail.cta.description_line1")}{" "}
                            {t("installment_detail.cta.description_line2")}
                        </p>

                        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-8">
                            <CtaPill text={t("installment_detail.cta.pills.instant")} />
                            <CtaPill text={t("installment_detail.cta.pills.steps")} />
                            <CtaPill text={t("installment_detail.cta.pills.secure")} />
                        </div>

                        <button
                            onClick={() =>
                                navigate("/payments", { state: { recommendedMode: mode } })
                            }
                            className="px-16 py-4 bg-black text-white rounded-full text-sm tracking-wide hover:bg-gray-800 transition"
                        >
                            {t("installment_detail.cta.button")}
                        </button>
                    </div>
                </motion.div>
            </section>
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
    const { t } = useTranslation("common");

    return (
        <section className="py-14 md:py-20">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7 }}
                className="max-w-5xl mx-auto px-6"
            >
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="text-blue-600" />
                        <span className="text-xs tracking-[0.35em] text-gray-500">
                            {t("installment_detail.hero.kicker")}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-semibold leading-[1.55] md:leading-[1.35] mb-6 md:mb-8">
                        <Trans
                            ns="common"
                            i18nKey="installment_detail.hero.title"
                            components={{
                                brand: <span className="text-red-600" />,
                            }}
                        />
                    </h1>

                    <p className="text-gray-800 text-lg sm:text-xl leading-relaxed font-medium max-w-xl">
                        {t("installment_detail.hero.description")}
                    </p>

                    <div className="flex flex-wrap gap-6 mt-6 mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-800"><CheckCircle2 className="text-green-500 w-5 h-5" /> {t("installment_detail.hero.chips.fast")}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-800"><CheckCircle2 className="text-green-500 w-5 h-5" /> {t("installment_detail.hero.chips.secure")}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-800"><CheckCircle2 className="text-green-500 w-5 h-5" /> {t("installment_detail.hero.chips.premium")}</div>
                    </div>

                    <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onCalculate}
                            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg hover:shadow-xl transition-shadow inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                        >
                            {t("installment_detail.hero.button")} <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        <div className="w-full sm:w-auto px-6 py-4 rounded-xl bg-gray-50 ring-1 ring-black/5 shadow-sm flex items-center gap-3">
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
                </div>
            </motion.div>
        </section>
    );
};

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

const CtaPill = ({ text }: { text: string }) => (
    <span className="px-3 py-1.5 rounded-full bg-white ring-1 ring-black/5 text-xs sm:text-sm font-semibold text-gray-700">
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
