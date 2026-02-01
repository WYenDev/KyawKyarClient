import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/* ===== Image ===== */
import heroImg from "../assets/swift-processing.jpg";

/* ===== Animation Presets ===== */
const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

const SwiftProcessing = () => {
    const navigate = useNavigate();

    return (
        <main className="bg-white text-gray-900 overflow-hidden">
            {/* ======================================================
          HERO – SPLIT EDITORIAL (PAGE LOAD)
      ====================================================== */}
            <section>
                <div className="max-w-7xl mx-auto px-6 py-28">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        {/* IMAGE */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-[500px] rounded-3xl overflow-hidden shadow-xl"
                        >
                            <img
                                src={heroImg}
                                alt="Swift Processing"
                                className="w-full h-full object-cover"
                            />
                        </motion.div>

                        {/* TEXT */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <p className="uppercase tracking-[0.45em] text-xs text-gray-500 mb-6">
                                Why Kyaw Kyar
                            </p>

                            <h1 className="text-5xl font-semibold leading-[1.1] mb-8">
                                Swift Processing.
                                <br />
                                Zero Wasted Time.
                            </h1>

                            <p className="text-lg text-gray-600 leading-relaxed max-w-md mb-12">
                                Speed is not achieved by rushing decisions.
                                It is achieved through preparation,
                                coordination, and a process
                                engineered to work from the start.
                            </p>

                            <button
                                onClick={() => navigate("/Buycars")}
                                className="inline-flex items-center gap-4 px-14 py-4 bg-black text-white text-sm tracking-wide rounded-full hover:bg-gray-800 transition"
                            >
                                Explore Cars
                                <span className="text-lg">→</span>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ======================================================
          INTRO – SCROLL ANIMATION
      ====================================================== */}
            <section className="py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto px-6 text-center"
                >
                    <div className="w-12 h-px bg-gray-300 mx-auto mb-10" />
                    <p className="text-2xl text-gray-800 leading-relaxed">
                        Swift processing is not about speed.
                        <br />
                        It is about removing friction
                        before it ever reaches you.
                    </p>
                </motion.div>
            </section>

            {/* ======================================================
          PROCESS – EDITORIAL STORY (SCROLL)
      ====================================================== */}
            <section className="py-36 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-6xl mx-auto px-6 space-y-40">
                    <StoryBlock
                        index="01"
                        label="ALIGNMENT"
                        title="Clear from the Start"
                        paragraphs={[
                            "Every successful transaction begins with clarity. Before anything moves forward, we confirm all requirements in detail — documentation, ownership records, timelines, and responsibilities.",
                            "Nothing proceeds on assumptions. Nothing is left open to interpretation.",
                            "This upfront alignment eliminates confusion, prevents rework, and protects you from unexpected delays later."
                        ]}
                    />

                    <StoryBlock
                        index="02"
                        label="PREPARATION"
                        title="Prepared in Advance"
                        paragraphs={[
                            "Our teams do not wait for urgency to act. Preparation begins the moment alignment is complete — not when pressure appears.",
                            "Documentation, coordination, and verification are handled ahead of time so progress does not depend on last-minute actions.",
                            "When you are ready to proceed, everything is already in place."
                        ]}
                    />

                    <StoryBlock
                        index="03"
                        label="VERIFICATION"
                        title="Verified with Discipline"
                        paragraphs={[
                            "Verification is conducted only through trusted channels and established procedures.",
                            "We do not rely on shortcuts, assumptions, or informal checks.",
                            "This disciplined approach ensures accuracy, consistency, and confidence at every stage."
                        ]}
                    />

                    <StoryBlock
                        index="04"
                        label="COMPLETION"
                        title="Completed Properly"
                        paragraphs={[
                            "Completion is treated with the same care as the beginning.",
                            "Final confirmations and handover are clear, documented, and deliberate.",
                            "When the process is finished, it is finished — cleanly, confidently, and without loose ends."
                        ]}
                    />
                </div>
            </section>

            {/* ======================================================
          CLOSING – SCROLL ANIMATION
      ====================================================== */}
            <section className="py-32">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto px-6 text-center"
                >
                    <h2 className="text-4xl font-semibold mb-8">
                        Fast, By Design.
                    </h2>

                    <p className="text-lg text-gray-600 leading-relaxed mb-14">
                        Swift processing is the result of preparation,
                        structure, and accountability.
                        <br />
                        It is how we respect your time
                        and protect your decision.
                    </p>

                    <button
                        onClick={() => navigate("/Buycars")}
                        className="inline-flex items-center gap-4 px-16 py-4 bg-black text-white text-sm tracking-wide rounded-full hover:bg-gray-800 transition"
                    >
                        Browse Cars with Confidence
                        <span className="text-lg">→</span>
                    </button>
                </motion.div>
            </section>
        </main>
    );
};

/* ======================================================
   STORY BLOCK – SCROLL ANIMATION
====================================================== */

const StoryBlock = ({
    index,
    label,
    title,
    paragraphs,
}: {
    index: string;
    label: string;
    title: string;
    paragraphs: string[];
}) => (
    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative grid md:grid-cols-[90px_1fr] gap-12"
    >
        {/* LEFT INDEX */}
        <div className="hidden md:flex flex-col items-center">
            <span className="text-7xl font-light text-gray-200">
                {index}
            </span>
            <div className="w-px flex-1 bg-gray-200 mt-6" />
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
            <p className="text-xs tracking-[0.35em] text-gray-500 font-medium">
                {label}
            </p>

            <h3 className="text-3xl font-semibold leading-tight">
                {title}
            </h3>

            {paragraphs.map((text, i) => (
                <p
                    key={i}
                    className={`text-lg leading-relaxed ${i === paragraphs.length - 1
                            ? "text-gray-900 font-medium"
                            : "text-gray-600"
                        }`}
                >
                    {text}
                </p>
            ))}
        </div>
    </motion.div>
);

export default SwiftProcessing;
