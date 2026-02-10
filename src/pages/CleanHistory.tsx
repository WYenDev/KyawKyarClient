import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    FileCheck2,
    Ban,
    CheckCircle2,
} from "lucide-react";

/* ===== Image ===== */
import steeringImg from "../assets/clearhistory.png";

/* ===== Animations ===== */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

const fadeLeft = {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
};

const fadeRight = {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
};

const CleanHistory = () => {
    const navigate = useNavigate();
    const { t } = useTranslation("cleanHistory");

    return (
        <main className="bg-white text-gray-900 overflow-hidden">
            {/* ======================================================
          HERO – IMAGE + BRAND PROMISE
      ====================================================== */}
            <section className="pt-32 pb-36">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center"
                >
                    {/* IMAGE */}
                    <div className="h-[420px] rounded-3xl overflow-hidden bg-gray-100">
                        <img
                            src={steeringImg}
                            alt={t("hero.alt")}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* TEXT */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-emerald-600" />
                            <span className="text-xs tracking-[0.35em] text-gray-500">
                                {t("hero.badge")}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-8">
                            {t("hero.title")}
                            <br />
                            {t("hero.titleLine2")}
                        </h1>

                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            {t("hero.description")}
                            <br />
                            {t("hero.descriptionLine2")}
                        </p>

                        <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-lg">
                            {t("hero.policy")}
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* ======================================================
          TRUST STRIP – COMPACT & CALM
      ====================================================== */}
            <section className="py-24 bg-gray-50">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-14 text-center"
                >
                    <TrustItem
                        icon={<FileCheck2 />}
                        title={t("trust.verifiedDoc.title")}
                        desc={t("trust.verifiedDoc.description")}
                    />
                    <TrustItem
                        icon={<Ban />}
                        title={t("trust.zeroRisk.title")}
                        desc={t("trust.zeroRisk.description")}
                    />
                    <TrustItem
                        icon={<ShieldCheck />}
                        title={t("trust.buyerProtection.title")}
                        desc={t("trust.buyerProtection.description")}
                    />
                </motion.div>
            </section>

            {/* ======================================================
          REJECTION POLICY – EDITORIAL STYLE
      ====================================================== */}
            <section className="py-36">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeUp}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl font-semibold mb-20 text-center"
                    >
                        {t("rejection.sectionTitle")}
                    </motion.h2>

                    <div className="border-l border-gray-200 pl-10 space-y-24">
                        <RejectLine
                            title={t("rejection.noOwnerBook.title")}
                            desc={t("rejection.noOwnerBook.description")}
                            animation={fadeLeft}
                        />

                        <RejectLine
                            title={t("rejection.noIllegalMods.title")}
                            desc={t("rejection.noIllegalMods.description")}
                            animation={fadeRight}
                        />

                        <RejectLine
                            title={t("rejection.noLegalExposure.title")}
                            desc={t("rejection.noLegalExposure.description")}
                            animation={fadeLeft}
                        />
                    </div>
                </div>
            </section>

            {/* ======================================================
          GUARANTEE – SOFT PANEL
      ====================================================== */}
            <section className="py-32 bg-gray-50">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="max-w-5xl mx-auto px-6"
                >
                    <div className="bg-white rounded-3xl border border-gray-200 p-16">
                        <h2 className="text-3xl font-semibold mb-12 text-center">
                            {t("guarantee.sectionTitle")}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <Guarantee text={t("guarantee.items.verifiedOwnership")} />
                            <Guarantee text={t("guarantee.items.noHiddenLegal")} />
                            <Guarantee text={t("guarantee.items.transparentHistory")} />
                            <Guarantee text={t("guarantee.items.resaleConfidence")} />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ======================================================
          CTA
      ====================================================== */}
            <section className="py-32">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto px-6 text-center"
                >
                    <h2 className="text-3xl font-semibold mb-6">
                        {t("cta.title")}
                    </h2>

                    <p className="text-gray-600 text-lg leading-relaxed mb-14">
                        {t("cta.description")}
                    </p>

                    <button
                        onClick={() => navigate("/buyCars")}
                        className="px-16 py-4 bg-black text-white rounded-full text-sm tracking-wide hover:bg-gray-800 transition"
                    >
                        {t("cta.button")}
                    </button>
                </motion.div>
            </section>
        </main>
    );
};

/* ================= COMPONENTS ================= */

const TrustItem = ({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) => (
    <motion.div variants={fadeUp}>
        <div className="w-14 h-14 rounded-full bg-white shadow-sm mx-auto flex items-center justify-center mb-6 text-gray-700">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600">{desc}</p>
    </motion.div>
);

const RejectLine = ({
    title,
    desc,
    animation,
}: {
    title: string;
    desc: string;
    animation: any;
}) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={animation}
        transition={{ duration: 0.6, ease: "easeOut" }}
    >
        <div className="flex items-start gap-6">
            <div className="mt-2">
                <Ban className="text-red-500" />
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-3">{title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                    {desc}
                </p>
            </div>
        </div>
    </motion.div>
);

const Guarantee = ({ text }: { text: string }) => (
    <div className="flex items-start gap-4">
        <CheckCircle2 className="text-emerald-600 mt-1" />
        <p className="text-gray-700 text-lg">{text}</p>
    </div>
);

export default CleanHistory;
