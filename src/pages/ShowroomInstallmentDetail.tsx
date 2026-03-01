import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    Clock,
    FileText,
    ShieldCheck,
    Landmark,
} from "lucide-react";

type Mode = "showroom" | "bank";

const BANKS = ["KBZ Bank", "AYA Bank", "CB Bank", "Other Local Banks"];

const InstallmentDetail = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<Mode>("showroom");

    return (
        <section className="bg-white overflow-hidden">
            {/* ================= HERO ================= */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl mx-auto pt-24 px-6 text-left md:text-center"
            >
                <h1 className="text-4xl lg:text-5xl font-black mb-6">
                    Installment Options at{" "}
                    <span className="whitespace-nowrap">Kyaw Kyar</span>
                </h1>
                <p className="text-slate-600 text-lg leading-8 max-w-3xl md:mx-auto">
                    Kyaw Kyar တွင် showroom payment ဖြင့်လည်းငွေပေးချေနိုင်ပြီး၊ <br />
                    customer အသုံးပြုနေသော ဘဏ်အားလုံးဖြင့်လည်း
                    payment ဆောင်ရွက်နိုင်ပါသည်။
                </p>
            </motion.div>

            {/* ================= TOGGLE ================= */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex justify-center mt-14"
            >
                <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
                    <ToggleButton
                        active={mode === "showroom"}
                        onClick={() => setMode("showroom")}
                        label="Showroom Payment"
                    />
                    <ToggleButton
                        active={mode === "bank"}
                        onClick={() => setMode("bank")}
                        label="Bank Payment"
                    />
                </div>
            </motion.div>

            {/* ================= CONTENT ================= */}
            <div className="mt-20 px-6">
                <AnimatePresence mode="wait">
                    {mode === "showroom" ? (
                        <ShowroomBlock key="showroom" />
                    ) : (
                        <BankBlock key="bank" />
                    )}
                </AnimatePresence>
            </div>

            {/* ================= BANK LIST ================= */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto mt-20 px-6"
            >
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">
                    Accepted Banks
                </h3>

                <div className="flex flex-wrap gap-3">
                    {BANKS.map((bank, i) => (
                        <motion.span
                            key={bank}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08 }}
                            className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold"
                        >
                            {bank}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            {/* ================= CTA ================= */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto mt-28 px-6 pb-28"
            >
                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-6
                     p-10 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600
                     text-white shadow-xl"
                >
                    <div>
                        <h3 className="text-2xl font-bold mb-2">
                            Calculate Your Payment
                        </h3>
                        <p className="text-blue-100">
                            မိမိအတွက် အဆင်ပြေဆုံး payment ကို ချက်ချင်းတွက်ကြည့်နိုင်ပါတယ်
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                            navigate("/payments", {
                                state: { recommendedMode: mode },
                            })
                        }
                        className="px-8 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg shadow-lg"
                    >
                        Calculate Now
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default InstallmentDetail;

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
        className={`px-6 py-3 rounded-xl font-bold transition-all
      ${active
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
        x: dir * 80,
    }),
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: (dir: number) => ({
        opacity: 0,
        x: dir * -60,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 1, 1],
        },
    }),
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

/* ================= BLOCKS ================= */

const ShowroomBlock = () => (
    <motion.div
        custom={-1}
        variants={blockVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="max-w-4xl mx-auto border border-slate-100 rounded-3xl p-12 shadow-sm"
    >
        <h2 className="text-2xl font-bold mb-4">Showroom Payment</h2>

        <p className="text-slate-600 mb-10 max-w-2xl">
            Kyaw Kyar showroom တွင် payment ဆောင်ရွက်နိုင်ပြီး
            စာရွက်စာတမ်းကိစ္စများကို showroom မှ စီမံပေးပါသည်။
        </p>

        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-6"
        >
            <motion.div variants={itemVariants}>
                <Benefit icon={<Clock />} title="Fast & Simple" desc="လုပ်ငန်းစဉ် ရိုးရှင်းပြီး အချိန်ကုန်သက်သာပါသည်" />
            </motion.div>
            <motion.div variants={itemVariants}>
                <Benefit icon={<FileText />} title="Paperwork Assisted" desc="စာရွက်စာတမ်းကိစ္စများကို showroom မှ တာ၀န်ယူဆောင်ရွက်ပေးပါသည်" />
            </motion.div>
            <motion.div variants={itemVariants}>
                <Benefit icon={<ShieldCheck />} title="Clear Payment" desc="Payment process ကို သည် ရှင်းလင်း မြန်ဆန်ပါသည်" />
            </motion.div>
        </motion.div>
    </motion.div>
);

const BankBlock = () => (
    <motion.div
        custom={1}
        variants={blockVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="max-w-4xl mx-auto border border-slate-100 rounded-3xl p-12 shadow-sm"
    >
        <h2 className="text-2xl font-bold mb-4">Bank Payment</h2>

        <p className="text-slate-600 mb-10 max-w-2xl">
            Kyaw Kyar တွင် KBZ၊ AYA၊ CB အပါအဝင်
            customer အသုံးပြုနေသော ဘဏ်အားလုံးဖြင့်
            payment ဆောင်ရွက်နိုင်ပါသည်။
        </p>

        <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-6"
        >
            <motion.div variants={itemVariants}>
                <Benefit icon={<Landmark />} title="All Major Banks Accepted" desc="Customer အသုံးပြုနေသော ဘဏ်အားလုံးကို လက်ခံပါသည်" />
            </motion.div>
            <motion.div variants={itemVariants}>
                <Benefit icon={<ShieldCheck />} title="Secure Transactions" desc="Payment process ကို လုံခြုံစိတ်ချစွာ ဆောင်ရွက်နိုင်ပါသည်" />
            </motion.div>
        </motion.div>
    </motion.div>
);

/* ================= BENEFIT ================= */

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
        <div className="text-blue-600">{icon}</div>
        <div>
            <h4 className="font-bold">{title}</h4>
            <p className="text-slate-600 text-sm">{desc}</p>
        </div>
    </div>
);
