
import React, { useState } from "react";

const CarPurchaseGuide: React.FC = () => {
    const [incomeType, setIncomeType] = useState<"business" | "employee">(
        "business"
    );

    return (
        <section className="max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200">
                    <p className="text-base font-semibold text-slate-800">
                        အရစ်ကျလျှောက်ထားရန် လိုအပ်သော စာရွက်စာတမ်းများ
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        အောက်ပါစာရွက်စာတမ်းများကို
                        ယူလာရန် လိုအပ်ပါသည်။
                    </p>
                </div>

                {/* Content */}
                <div className="px-6 py-6 space-y-8">
                    {/* Customer Base */}
                    <InfoSection title="ဝယ်ယူသူ (Customer) – အခြေခံလိုအပ်ချက်">
                        <CheckItem text="မှတ်ပုံတင် (NRC) သို့မဟုတ် အိမ်ထောင်စုဇယား" />
                        <CheckItem text="လိုင်စင်ဓာတ်ပုံ (၂) ပုံ" />
                        <CheckItem text="ရပ်ကွက်ထောက်ခံစာ (မူရင်း)" />
                    </InfoSection>

                    {/* Income Type Toggle */}
                    <div>
                        <div className="flex gap-2">
                            <ToggleButton
                                active={incomeType === "business"}
                                onClick={() => setIncomeType("business")}
                                label="လုပ်ငန်းရှင်"
                            />
                            <ToggleButton
                                active={incomeType === "employee"}
                                onClick={() => setIncomeType("employee")}
                                label="ဝန်ထမ်း"
                            />
                        </div>
                    </div>

                    {/* Conditional Requirements */}
                    {incomeType === "business" && (
                        <InfoSection title="လုပ်ငန်းရှင် ဖြစ်ပါက">
                            <CheckItem text="လုပ်ငန်းလိုင်စင်" />
                            <CheckItem text="အရှုး / အမြတ် စာရင်း (၂) နှစ်" />
                            <CheckItem text="အမြတ်ခွန် ပြေစာ (၂) နှစ်" />
                        </InfoSection>
                    )}

                    {incomeType === "employee" && (
                        <InfoSection title="ဝန်ထမ်း ဖြစ်ပါက">
                            <CheckItem text="လစာ ပြေစာ (နောက်ဆုံး ၃ လ)" />
                            <CheckItem text="ဝန်ထမ်းဖြစ်ကြောင်း ထောက်ခံစာ" />
                            <CheckItem text="ဝင်ငွေခွန် ပြေစာ (၂) နှစ်" />
                        </InfoSection>
                    )}

                    {/* Guarantor */}
                    <InfoSection title="အာမခံသူ (Guarantor)">
                        <CheckItem text="လိုင်စင်ဓာတ်ပုံ (၂) ပုံ" />
                        <CheckItem text="မှတ်ပုံတင် (NRC) သို့မဟုတ် အိမ်ထောင်စုဇယား" />
                        <CheckItem text="ရပ်ကွက်ထောက်ခံစာ (မူရင်း)" />
                    </InfoSection>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-200 text-xs text-slate-500 bg-slate-50 rounded-b-2xl">
                    * Bank Approval ရရှိပြီးမှသာ အရစ်ကျလုပ်ငန်းစဉ်ကို
                    ဆက်လက်ဆောင်ရွက်နိုင်ပါသည်။
                </div>
            </div>
        </section>
    );
};

/* ---------- UI Helpers ---------- */

const InfoSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div>
        <p className="font-medium text-sm text-slate-700 mb-3">
            {title}
        </p>
        <ul className="space-y-2">{children}</ul>
    </div>
);

const CheckItem = ({ text }: { text: string }) => (
    <li className="flex items-start gap-2 text-sm text-slate-600">
        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
        <span>{text}</span>
    </li>
);

const ToggleButton = ({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm border transition
        ${active
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            }`}
    >
        {label}
    </button>
);

export default CarPurchaseGuide;
