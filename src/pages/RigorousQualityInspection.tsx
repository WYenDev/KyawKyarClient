import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ===== Images ===== */
import heroImg from "../assets/Servicce.png";
import documentImg from "../assets/rqi-1.png";
import inspectionImg from "../assets/rqi-2.png";
import performanceImg from "../assets/rqi-3.png";
import approvalImg from "../assets/rqi-4.png";

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
            {/* ======================================================
          HERO
      ====================================================== */}
            <section className="relative h-[620px]">
                <motion.img
                    src={heroImg}
                    alt="Rigorous Quality Inspection"
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/55" />

                <div className="relative z-10 h-full flex items-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-6xl mx-auto px-6 text-white"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
                            Rigorous Quality Inspection
                        </h1>
                        <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">
                            Kyaw Kyar တွင် ကားတစ်စီးကို showroom မှာတင်မီ
                            လက်တင်စီးအဆင့်အထိ စစ်ဆေးမှုအဆင့်ဆင့်ကို
                            တင်းကြပ်စွာ ကျော်ဖြတ်ရပါသည်။
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ======================================================
          INTRO
      ====================================================== */}
            <section className="py-28">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto px-6 text-center"
                >
                    <h2 className="text-3xl font-semibold mb-6">
                        Why Our Inspection Is Different
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        ၀ယ်ယူသူများအတွက် ယုံကြည်စိတ်ချရသော ကားများကို လက်တင်စီးနိုင်သောအဆင့်ထိ အဆင့်ဆင့်စစ်ဆေးမှုများ ပြုလုပ်ပါသည်။
                    </p>
                </motion.div>
            </section>

            {/* ======================================================
          PROCESS – LEFT / RIGHT FLOW
      ====================================================== */}
            <section className="py-32 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeUp}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl font-semibold text-center mb-24"
                    >
                        How We Rigorously Inspect Every Car
                    </motion.h2>

                    {/* STEP 01 */}
                    <ProcessRow
                        step="01"
                        title="Document & History Verification"
                        desc="Registration, ownership history နှင့် mileage data များကို  
            ပထမဆုံး စစ်ဆေးပါသည်။  
            ကိုက်ညီမှုမရှိပါက showroom သို့ မတင်မီ ဖယ်ရှားပါသည်။"
                        image={documentImg}
                        imageSide="left"
                    />

                    {/* STEP 02 */}
                    <ProcessRow
                        step="02"
                        title="Deep Physical & Mechanical Inspection"
                        desc="Engine, transmission နှင့် chassis များကို  
            ကျွမ်းကျင်သော technician များမှ  
            လက်တွေ့စစ်ဆေးပါသည်။"
                        image={inspectionImg}
                        imageSide="right"
                    />

                    {/* STEP 03 */}
                    <ProcessRow
                        step="03"
                        title="Performance & Road Test"
                        desc="လမ်းမပေါ်တွင် လက်တင်စီးအဆင့်အထိ မောင်းနှင်စမ်းသပ်ပြီး  
            braking၊ vibration နှင့် handling များကို စစ်ဆေးပါသည်။"
                        image={performanceImg}
                        imageSide="left"
                    />

                    {/* STEP 04 */}
                    <ProcessRow
                        step="04"
                        title="Independent Quality Approval"
                        desc="Quality team မှ သီးခြားပြန်လည်စစ်ဆေးပြီး  
            စံနှုန်းပြည့်မီသောကားများကိုသာ  
            showroom တွင် တင်ရောင်းခွင့်ပေးပါသည်။"
                        image={approvalImg}
                        imageSide="right"
                    />
                </div>
            </section>

            {/* ======================================================
          CLOSING
      ====================================================== */}
            <section className="py-28">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto px-6 text-center"
                >
                    <h2 className="text-3xl font-semibold mb-6">
                        Quality Comes Before Everything
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-10">
                        လက်တင်စီးအဆင့်မရောက်သေးသောကားများကို
                        ကျွန်ုပ်တို့ showroom တွင် မည်သည့်အခါမျှ မတင်ပါ။
                    </p>

                    <button
                        onClick={() => navigate("/buyCars")}
                        className="px-10 py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                    >
                        Browse Quality-Inspected Cars
                    </button>
                </motion.div>
            </section>
        </main>
    );
};

/* ======================================================
   PROCESS ROW
====================================================== */

const ProcessRow = ({
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
    const imageFirst = imageSide === "left";

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={fadeSide(imageSide)}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="grid md:grid-cols-2 gap-16 items-center mb-32"
        >
            {/* IMAGE */}
            <div className={imageFirst ? "order-1" : "order-2"}>
                <div className="h-[340px] rounded-xl overflow-hidden bg-gray-100 shadow-md">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* TEXT */}
            <div className={imageFirst ? "order-2" : "order-1"}>
                <span className="text-sm font-semibold text-gray-400">
                    STEP {step}
                </span>
                <h3 className="text-2xl font-semibold mt-3 mb-6">
                    {title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg max-w-xl">
                    {desc}
                </p>
            </div>
        </motion.div>
    );
};

export default RigorousQualityInspection;
