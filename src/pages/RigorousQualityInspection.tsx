import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

    return (
        <main className="bg-white text-gray-900 overflow-hidden">
            {/* ================= HERO ================= */}
            <section className="relative h-[520px] md:h-[620px]">
                <motion.img
                    src={heroImg}
                    alt="Rigorous Quality Inspection"
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
                            Rigorous Quality Inspection
                        </h1>
                        <p className="text-gray-200 max-w-2xl leading-relaxed">
                            Kyaw Kyar တွင် ကားတစ်စီးကို showroom မှာတင်မီ
                            လက်တင်စီးအဆင့်အထိ စစ်ဆေးမှုအဆင့်ဆင့်ကို
                            တင်းကြပ်စွာ ကျော်ဖြတ်ရပါသည်။
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
                        How We Inspect Every Car
                    </motion.h2>

                    <Step
                        step="01"
                        title="Document & History Verification"
                        desc="Registration၊ ownership history နှင့် mileage data များကို စစ်ဆေးပြီး မကိုက်ညီပါက showroom မတင်ပါ။"
                        image={step1Img}
                        imageSide="left"
                    />

                    <Step
                        step="02"
                        title="Physical & Mechanical Inspection"
                        desc="Engine၊ transmission နှင့် chassis များကို ကျွမ်းကျင်သော technician များမှ စစ်ဆေးပါသည်။"
                        image={step2Img}
                        imageSide="right"
                    />

                    <Step
                        step="03"
                        title="Performance & Road Test"
                        desc="လမ်းမပေါ်တွင် လက်တင်စီးစမ်းသပ်ပြီး braking နှင့် handling ကို စစ်ဆေးပါသည်။"
                        image={step3Img}
                        imageSide="left"
                    />

                    <Step
                        step="04"
                        title="Independent Quality Approval"
                        desc="Quality team မှ ပြန်လည်စစ်ဆေးပြီး စံနှုန်းပြည့်မီမှသာ showroom တင်ပါသည်။"
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
                        Quality Comes Before Everything
                    </h2>
                    <p className="text-gray-600 mb-10">
                        စံနှုန်းမပြည့်မီသော ကားများကို
                        မည်သည့်အခါမျှ မတင်ပါ။
                    </p>

                    <button
                        onClick={() => navigate("/buyCars")}
                        className="px-10 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                    >
                        Browse Quality Cars
                    </button>
                </motion.div>
            </section>
        </main>
    );
};

/* ================= STEP ================= */
const Step = ({
    step,
    title,
    desc,
    image,
    imageSide,
}: {
    step: string;
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
                    STEP {step}
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
