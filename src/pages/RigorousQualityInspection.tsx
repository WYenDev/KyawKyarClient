import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SEO from '../components/SEO';

/* ===== Images ===== */
import heroImg from "../assets/Servicce.png";
import step1Img from "../assets/rqi-1.png";
import step2Img from "../assets/rqi-2.png";
import step3Img from "../assets/rqi-3.png";
import step4Img from "../assets/rqi-4.png";

/* ===== Animations ===== */
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

const fadeSide = (from: "left" | "right") => ({
    hidden: { opacity: 0, x: from === "left" ? -40 : 40 },
    visible: { opacity: 1, x: 0 },
});

const RigorousQualityInspection = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('rqi');

    return (
        <main className="bg-white text-gray-900 overflow-hidden">
            <SEO
                title={t('meta.title')}
                description={t('meta.description')}
            />
            {/* ======================================================
          HERO
      ====================================================== */}
               <section className="relative h-[520px] md:h-[620px]">
                <motion.img
                    src={heroImg}
                    alt={t('hero.title')}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/55" />

                <div className="relative z-10 h-full flex items-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="max-w-5xl mx-auto px-6 text-white"
                    >
                        <h1 className="text-3xl md:text-5xl font-bold mb-6">
                            {t('hero.title')}
                        </h1>
                        <p className="text-gray-200 max-w-2xl leading-relaxed">
                            {t('hero.description')}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ================= PROCESS ================= */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeUp}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-semibold text-center mb-20"
                    >
                        {t('process.sectionTitle')}
                    </motion.h2>

                    <Step
                        step="01"
                        stepLabel={t('process.stepLabel')}
                        title={t('steps.01.title')}
                        desc={t('steps.01.description')}
                        image={step1Img}
                        imageSide="left"
                    />

                    <Step
                        step="02"
                        stepLabel={t('process.stepLabel')}
                        title={t('steps.02.title')}
                        desc={t('steps.02.description')}
                        image={step2Img}
                        imageSide="right"
                    />

                    <Step
                        step="03"
                        stepLabel={t('process.stepLabel')}
                        title={t('steps.03.title')}
                        desc={t('steps.03.description')}
                        image={step3Img}
                        imageSide="left"
                    />

                    <Step
                        step="04"
                        stepLabel={t('process.stepLabel')}
                        title={t('steps.04.title')}
                        desc={t('steps.04.description')}
                        image={step4Img}
                        imageSide="right"
                    />
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeUp}
                    className="max-w-4xl mx-auto px-6 text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                        {t('cta.title')}
                    </h2>
                    <p className="text-gray-600 mb-10">
                        {t('cta.description')}
                    </p>

                    <button
                        onClick={() => navigate("/buyCars")}
                        className="px-10 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                    >
                        {t('cta.button')}
                    </button>
                </motion.div>
            </section>
        </main>
    );
};

/* ================= STEP ================= */
const Step = ({
    step,
    stepLabel,
    title,
    desc,
    image,
    imageSide,
}: {
    step: string;
    stepLabel: string;
    title: string;
    desc: string;
    image: string;
    imageSide: "left" | "right";
}) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeSide(imageSide)}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-24"
        >
            {/* TEXT – always first on mobile */}
            <div className={imageSide === "left" ? "md:order-2" : "md:order-1"}>
                <span className="text-sm font-semibold text-gray-400">
                    {stepLabel} {step}
                </span>
                <h3 className="text-xl md:text-2xl font-semibold mt-3 mb-4">
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed max-w-xl">
                    {desc}
                </p>
            </div>

            {/* IMAGE – always below text on mobile */}
            <div className={imageSide === "left" ? "md:order-1" : "md:order-2"}>
                <div className="h-[220px] md:h-[340px] rounded-xl overflow-hidden shadow-md mt-6 md:mt-0">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                </div>
            </div>
        </motion.div>
    );
};

export default RigorousQualityInspection;
