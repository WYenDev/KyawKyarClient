
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, User, Briefcase, Users, Info, CheckCircle2 } from "lucide-react";

const CarPurchaseGuide: React.FC = () => {
    const { t, i18n } = useTranslation("common");
    const isMyanmar = i18n?.language?.startsWith('mm');
    const [incomeType, setIncomeType] = useState<"business" | "employee">(
        "business"
    );

    return (
        <section className="w-full mt-10">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-3 mb-1">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h3 className={`text-xl font-bold text-slate-900 ${isMyanmar ? 'font-myanmar' : ''}`}>
                            {t("purchase_guide.title")}
                        </h3>
                    </div>
                    <p className={`text-xs text-slate-500 ml-8 ${isMyanmar ? 'font-myanmar' : ''}`}>
                        {t("purchase_guide.subtitle")}
                    </p>
                </div>

                {/* Content */}
                <div className="p-8 space-y-10">
                    {/* Customer Base */}
                    <div className="grid md:grid-cols-2 gap-10">
                        <InfoSection 
                            icon={<User className="w-4 h-4 text-indigo-500" />}
                            title={t("purchase_guide.customer_base_title")}
                            isMyanmar={isMyanmar}
                        >
                            <CheckItem text={t("purchase_guide.nrc_household")} isMyanmar={isMyanmar} />
                            <CheckItem text={t("purchase_guide.license_photo")} isMyanmar={isMyanmar} />
                            <CheckItem text={t("purchase_guide.ward_recommendation")} isMyanmar={isMyanmar} />
                        </InfoSection>

                        {/* Guarantor */}
                        <InfoSection 
                            icon={<Users className="w-4 h-4 text-indigo-500" />}
                            title={t("purchase_guide.guarantor_title")}
                            isMyanmar={isMyanmar}
                        >
                            <CheckItem text={t("purchase_guide.license_photo")} isMyanmar={isMyanmar} />
                            <CheckItem text={t("purchase_guide.nrc_household")} isMyanmar={isMyanmar} />
                            <CheckItem text={t("purchase_guide.ward_recommendation")} isMyanmar={isMyanmar} />
                        </InfoSection>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        {/* Income Type Toggle */}
                        <div className="flex items-center gap-4 mb-6">
                            <Briefcase className="w-4 h-4 text-indigo-500" />
                            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                                <ToggleButton
                                    active={incomeType === "business"}
                                    onClick={() => setIncomeType("business")}
                                    label={t("purchase_guide.business_owner")}
                                    isMyanmar={isMyanmar}
                                />
                                <ToggleButton
                                    active={incomeType === "employee"}
                                    onClick={() => setIncomeType("employee")}
                                    label={t("purchase_guide.employee")}
                                    isMyanmar={isMyanmar}
                                />
                            </div>
                        </div>

                        {/* Conditional Requirements */}
                        <div className="bg-indigo-50/30 rounded-2xl p-6 border border-indigo-50/50">
                            {incomeType === "business" && (
                                <InfoSection 
                                    title={t("purchase_guide.if_business_owner")}
                                    isMyanmar={isMyanmar}
                                >
                                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                                        <CheckItem text={t("purchase_guide.business_license")} isMyanmar={isMyanmar} />
                                        <CheckItem text={t("purchase_guide.profit_loss")} isMyanmar={isMyanmar} />
                                        <CheckItem text={t("purchase_guide.tax_receipt")} isMyanmar={isMyanmar} />
                                    </div>
                                </InfoSection>
                            )}

                            {incomeType === "employee" && (
                                <InfoSection 
                                    title={t("purchase_guide.if_employee")}
                                    isMyanmar={isMyanmar}
                                >
                                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
                                        <CheckItem text={t("purchase_guide.salary_slip")} isMyanmar={isMyanmar} />
                                        <CheckItem text={t("purchase_guide.employment_recommendation")} isMyanmar={isMyanmar} />
                                        <CheckItem text={t("purchase_guide.income_tax_receipt")} isMyanmar={isMyanmar} />
                                    </div>
                                </InfoSection>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-slate-50 text-xs text-slate-500 bg-slate-50/30 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 mt-0.5 text-indigo-400" />
                    <span className={isMyanmar ? 'font-myanmar leading-relaxed' : ''}>
                        {t("purchase_guide.bank_approval_note")}
                    </span>
                </div>
            </div>
        </section>
    );
};

/* ---------- UI Helpers ---------- */

const InfoSection = ({
    title,
    icon,
    children,
    isMyanmar
}: {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    isMyanmar?: boolean;
}) => (
    <div>
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <p className={`font-bold text-sm text-slate-700 uppercase tracking-tight ${isMyanmar ? 'font-myanmar' : ''}`}>
                {title}
            </p>
        </div>
        <ul className="space-y-3">{children}</ul>
    </div>
);

const CheckItem = ({ text, isMyanmar }: { text: string; isMyanmar?: boolean }) => (
    <li className="flex items-center gap-3 text-sm text-slate-600 group">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className={isMyanmar ? 'font-myanmar' : ''}>{text}</span>
    </li>
);

const ToggleButton = ({
    label,
    active,
    onClick,
    isMyanmar
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    isMyanmar?: boolean;
}) => (
    <button
        onClick={onClick}
        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all
        ${active
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            } ${isMyanmar ? 'font-myanmar' : ''}`}
    >
        {label}
    </button>
);

export default CarPurchaseGuide;
