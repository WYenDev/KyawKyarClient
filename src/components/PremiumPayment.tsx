import React, { useEffect, useMemo, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  ShieldCheck,
  ChevronDown,
  Gem,
  Wallet,
  ReceiptText,
  Calculator
} from "lucide-react";
import { useGetApiBankInstallments, useGetApiShowroomInstallments } from "../services/api";
import CarPurchaseGuide from "./CarPurchaseGuide";

/* ===== Premium Car Data ===== */
const car = {
  model: "Toyota Camry",
  series: "Executive Edition",
  color: "Champagne Gold",
  showroom: "Mandalay - 103 Street",
  buildType: "Japan Import",
  modelYear: 2026,
  price: 50000000,
  mileage: 2,
  enginePower: 1234,
  fuel: "Petrol",
  transmission: "Manual",
  isNewArrival: true,
};

const TAX = 200000;

const toBurmeseNum = (n: number | string) => {
  const nums: Record<string, string> = {
    '0': '၀', '1': '၁', '2': '၂', '3': '၃', '4': '၄',
    '5': '၅', '6': '၆', '7': '၇', '8': '၈', '9': '၉'
  };
  return n.toString().replace(/[0-9]/g, (match) => nums[match]);
};

type InstallmentMode = "bank" | "showroom";

const PremiumPayment: React.FC = () => {
  const { t, i18n } = useTranslation("common");
  const isMyanmar = i18n?.language?.startsWith('mm');
  const [installmentMode, setInstallmentMode] = useState<InstallmentMode | null>("showroom");

  /* ===== NEW: Calculator State ===== */
  const [customPrice, setCustomPrice] = useState(car.price);

  // Fetch installment configs
  const { data: bankInstallments } = useGetApiBankInstallments();
  const { data: showroomInstallments } = useGetApiShowroomInstallments();

  const bankConfig = useMemo(
    () => (Array.isArray(bankInstallments) && bankInstallments.length > 0 ? bankInstallments[0] : undefined),
    [bankInstallments]
  );

  const [selectedShowroomIndex, setSelectedShowroomIndex] = useState<number | null>(null);
  const showroomConfig = useMemo(() => {
    if (!Array.isArray(showroomInstallments) || showroomInstallments.length === 0) return undefined;
    if (selectedShowroomIndex == null) return undefined;
    return showroomInstallments[selectedShowroomIndex];
  }, [showroomInstallments, selectedShowroomIndex]);

  // Auto-select first showroom plan when user chooses showroom mode
  useEffect(() => {
    if (installmentMode === "showroom" && Array.isArray(showroomInstallments) && showroomInstallments.length > 0) {
      setSelectedShowroomIndex((prev) => (prev == null ? 0 : prev));
    }
    if (installmentMode === "bank") {
      setSelectedShowroomIndex(null);
    }
  }, [installmentMode, showroomInstallments]);

  /* ===== Financial Calculations ===== */
  const bankDerived = useMemo(() => {
    if (!bankConfig) return null;
    const initialPaymentPct = Number(bankConfig.initialPayment ?? 0) / 100;
    const depositPct = Number(bankConfig.deposit ?? 0) / 100;
    const initialPaymentAmt = customPrice * initialPaymentPct;
    const depositAmt = customPrice * depositPct;
    const upfront = initialPaymentAmt + depositAmt + TAX;
    const remaining = customPrice - (initialPaymentAmt + depositAmt);
    return { initialPaymentAmt, depositAmt, upfront, remaining };
  }, [bankConfig, customPrice]);

  const showroomDerived = useMemo(() => {
    if (!showroomConfig) return null;
    const initialPaymentPct = Number(showroomConfig.initialPayment ?? 0) / 100;
    const interestRatePct = Number(showroomConfig.interestRate ?? 0) / 100;
    const paperworkFeePct = Number((showroomConfig as any).paperWorkFee ?? 0) / 100;
    const durationYears = Number(showroomConfig.duration ?? 0);
    const months = Math.max(1, Math.round(durationYears * 12));
    const initialPaymentAmt = customPrice * initialPaymentPct;
    const paperworkAmt = customPrice * paperworkFeePct;
    const upfront = initialPaymentAmt + paperworkAmt;
    const remaining = customPrice - initialPaymentAmt;
    const baseMonthly = remaining / months;
    const interestMonthly = remaining * interestRatePct;
    const totalMonthly = baseMonthly + interestMonthly;
    return { months, initialPaymentAmt, paperworkAmt, upfront, remaining, baseMonthly, interestMonthly, totalMonthly };
  }, [showroomConfig, customPrice]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <main className="max-w-7xl mx-auto py-6 px-2 sm:py-12 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* LEFT: INTERACTIVE FORM AREA */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <header>
                 <div className="inline-flex items-center space-x-2 bg-white border border-slate-200/80 px-4 py-2 rounded-full shadow-sm mb-4">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="text-indigo-900 text-[11px] font-bold tracking-widest uppercase">
                      Payment Plans
                    </span>
                 </div>
                <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight md:leading-snug py-1 sm:py-3 tracking-tight ${isMyanmar ? 'font-myanmar sm:leading-relaxed max-sm:text-[1.6rem]' : ''}`}>
                   <span className="inline-block pt-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                      {t("payments_info.title", "Flexible Payment Options")}
                   </span>
                </h2>
                <p className={`text-base sm:text-lg text-slate-600 mt-4 leading-relaxed ${isMyanmar ? 'font-myanmar' : ''}`}>
                  <Trans
                    i18nKey="payments_info.description"
                    ns="common"
                    components={{
                      highlight: <span className="text-indigo-600 font-bold" />
                    }}
                  />
                </p>
              </header>
            </div>

            <div className="bg-white rounded-3xl sm:rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-3 sm:p-10">
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">

                    {/* Mobile: Scroll to Calculator Button */}
                    <button
                      onClick={() => document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full lg:hidden mb-6 bg-slate-900 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      <Calculator size={20} className="text-blue-400" />
                      <span>{t('buttons.calculate_payment', 'Calculate with Payment Calculator')}</span>
                      <ChevronDown size={20} className="text-slate-400" />
                    </button>

                    <div className="grid sm:grid-cols-2 gap-3 mb-8">
                      <button
                         onClick={() => setInstallmentMode('showroom')}
                        className={`p-3 sm:p-5 rounded-none border flex items-center gap-4 transition-all text-left group ${installmentMode === 'showroom'
                          ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-500 shadow-md'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'}`}
                      >
                        <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center transition-colors ${installmentMode === 'showroom' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600'}`}>
                          <Gem size={24} />
                        </div>
                        <div>
                           <span className={`block font-bold text-lg ${installmentMode === 'showroom' ? 'text-indigo-900' : 'text-slate-700'} ${isMyanmar ? 'font-myanmar' : ''}`}>
                           {t("payments_info.installment_items.showroom", "Showroom Installment")}
                           </span>
                           <span className={`text-sm ${installmentMode === 'showroom' ? 'text-indigo-700' : 'text-slate-500'}`}>
                             {isMyanmar ? 'ပြင်ဆင်ထားသော လစဉ်ကြေး' : 'Flexible months & rates'}
                          </span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => setInstallmentMode('bank')}
                         className={`p-3 sm:p-5 rounded-none border flex items-center gap-4 transition-all text-left group ${installmentMode === 'bank'
                          ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-500 shadow-md'
                          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'}`}
                      >
                         <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center transition-colors ${installmentMode === 'bank' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600'}`}>
                          <Wallet size={24} />
                        </div>
                         <div>
                           <span className={`block font-bold text-lg ${installmentMode === 'bank' ? 'text-indigo-900' : 'text-slate-700'} ${isMyanmar ? 'font-myanmar' : ''}`}>
                           {t("payments_info.installment_items.bank", "Bank Installment")}
                           </span>
                           <span className={`text-sm ${installmentMode === 'bank' ? 'text-indigo-700' : 'text-slate-500'}`}>
                             {isMyanmar ? 'ဘဏ်လုပ်ထုံးလုပ်နည်းများအတိုင်း' : 'Standard banking procedures'}
                          </span>
                        </div>
                      </button>
                    </div>

                    <div className="bg-slate-50 p-3 sm:p-6 rounded-3xl border border-slate-100 mb-6 space-y-3 sm:space-y-4 animate-in zoom-in-95 duration-300">
                      
                      {/* Showroom plan selection moved here */}
                        {installmentMode === "showroom" && Array.isArray(showroomInstallments) && showroomInstallments.length > 0 && (
                          <div className="space-y-4 sm:space-y-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                              <div className="flex items-center gap-2">
                                <ReceiptText size={18} className="text-blue-600" />
                                <label className="text-sm font-bold text-slate-600 uppercase">Choose Showroom Plan</label>
                              </div>
                              <div className="flex gap-2 flex-wrap sm:justify-end">
                                {showroomInstallments.map((plan, idx) => {
                                  const months = Math.max(1, Math.round(Number(plan?.duration ?? 0) * 12));
                                  const active = selectedShowroomIndex === idx;
                                  return (
                                    <button
                                      key={idx}
                                      onClick={() => setSelectedShowroomIndex(idx)}
                                      className={`px-4 py-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-black transition-all flex-1 sm:flex-none ${active ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200 shadow-sm"}`}
                                    >
                                      {months} MONTHS
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Dynamic Showroom Explanation Text */}
                            {showroomConfig && (
                              <div className="bg-blue-50/50 p-3 sm:p-4 rounded-xl border border-blue-100 text-slate-700 text-sm leading-relaxed">
                                {(() => {
                                   const durationVal = Math.max(1, Math.round(Number(showroomConfig.duration ?? 0) * 12));
                                   const initialVal = showroomConfig.initialPayment ?? 0;
                                   const paperworkVal = (showroomConfig as any).paperWorkFee ?? 0;
                                   const interestVal = showroomConfig.interestRate ?? 0;
                                   const remainingVal = 100 - Number(initialVal);
                                   
                                   const formatNum = (n: number | string) => isMyanmar ? toBurmeseNum(n) : n;

                                   return t("payments_info.showroom_details", {
                                      duration: formatNum(durationVal),
                                      initialPayment: formatNum(initialVal),
                                      paperworkFee: formatNum(paperworkVal),
                                      interestRate: formatNum(interestVal),
                                      remainingPct: formatNum(remainingVal)
                                   });
                                })()}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Charges summary moved below installment-type section (compact and only amounts) */}
                        <div className="mt-4">
                          <div className="p-3 bg-white rounded-xl border border-slate-100 text-sm">
                            <div className="font-semibold text-slate-700 mb-2">Charges</div>

                            {installmentMode === 'bank' && bankConfig && (
                              <div className="space-y-1 text-sm text-slate-700">
                                <div className="flex justify-between"><span>Initial Payment</span><span className="font-bold">{bankConfig.initialPayment}%</span></div>
                                <div className="flex justify-between"><span>Deposit</span><span className="font-bold">{bankConfig.deposit}%</span></div>
                                <div className="flex justify-between border-t pt-2"><span>Tax & Registration</span><span className="font-extrabold">{TAX.toLocaleString()} MMK</span></div>
                              </div>
                            )}

                            {installmentMode === 'showroom' && showroomConfig && (
                              <div className="space-y-1 text-sm text-slate-700">
                                <div className="flex justify-between"><span>Initial Payment</span><span className="font-bold">{showroomConfig.initialPayment}%</span></div>
                                <div className="flex justify-between"><span>Paperwork Fee</span><span className="font-bold">{(showroomConfig as any).paperWorkFee}%</span></div>
                                <div className="flex justify-between"><span>Interest Rate</span><span className="font-bold">{(showroomConfig.interestRate ?? 0)}%</span></div>
                              </div>
                            )}
                          </div>
                        </div>

                        {installmentMode === "bank" && (
                          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <CarPurchaseGuide />
                          </div>
                        )}

                      </div>

                  </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY CARD + CONDITIONAL CALCULATOR */}
          <div id="calculator-section" className="lg:col-span-4 sticky top-28 space-y-4 sm:space-y-6">
            
              <div className="bg-slate-900 rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden text-white p-4 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="text-blue-400" size={24} />
                  <h3 className="text-lg font-bold">{t("payments_info.calculator.title")}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("payments_info.calculator.vehicle_price")}</label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl font-bold text-xl text-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  {!installmentMode && (
                    <p className="text-xs text-slate-400">{t("payments_info.calculator.select_hint")}</p>
                  )}

                  {installmentMode === "bank" && bankDerived && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300">
                        {t("payments_info.calculator.bank_upfront_desc", {
                          initial: (bankConfig?.initialPayment ?? 0).toString(),
                          deposit: (bankConfig?.deposit ?? 0).toString()
                        })}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.initial_payment")}</span>
                        <span className="font-bold">{Math.round(bankDerived.initialPaymentAmt).toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.deposit")}</span>
                        <span className="font-bold">{Math.round(bankDerived.depositAmt).toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.tax_registration")}</span>
                        <span className="font-bold">{TAX.toLocaleString()} MMK</span>
                      </div>
                      <div className="my-3 border-t border-slate-800/60" />
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.total_upfront")}</span>
                        <span className="font-black text-blue-400">{Math.round(bankDerived.upfront).toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.remaining_bank")}</span>
                        <span className="font-bold">{Math.round(bankDerived.remaining).toLocaleString()} MMK</span>
                      </div>
                    </div>
                  )}

                  {installmentMode === "showroom" && showroomDerived && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300">
                        {t("payments_info.calculator.showroom_upfront_desc", {
                          initial: (showroomConfig?.initialPayment ?? 0).toString(),
                          paperwork: Math.round(showroomDerived.paperworkAmt).toLocaleString()
                        })}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.initial_payment")}</span>
                        <span className="font-bold">{Math.round(showroomDerived.initialPaymentAmt).toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.paperwork_fee")}</span>
                        <span className="font-bold">{Math.round(showroomDerived.paperworkAmt).toLocaleString()} MMK</span>
                      </div>
                      <div className="my-3 border-t border-slate-800/60" />
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.total_upfront")}</span>
                        <span className="font-black text-blue-400">{Math.round(showroomDerived.upfront).toLocaleString()} MMK</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.remaining")}</span>
                        <span className="font-bold">{Math.round(showroomDerived.remaining).toLocaleString()} MMK</span>
                      </div>
                      <div className="my-3 border-t border-slate-800/60" />
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.monthly_base", { months: showroomDerived.months })}</span>
                        <span className="font-bold">{showroomDerived.baseMonthly.toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.monthly_interest", { rate: (showroomConfig?.interestRate ?? 0) })}</span>
                        <span className="font-bold">{showroomDerived.interestMonthly.toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{t("payments_info.calculator.labels.total_monthly")}</span>
                        <span className="font-black text-blue-400">{showroomDerived.totalMonthly.toLocaleString()} MMK</span>
                      </div>
                    </div>
                  )}

                  {/* Compact summary at end of calculator */}
                  <div className="mt-4">
                    {installmentMode === 'bank' && bankDerived && (
                      <div className="rounded-xl p-3 sm:p-4 bg-gradient-to-r from-blue-900 to-slate-800 border border-blue-700 shadow-lg ring-1 ring-blue-600/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-blue-200 font-semibold">{t("payments_info.calculator.summary.bank_title")}</div>
                            <div className="text-sm text-slate-200">{t("payments_info.calculator.labels.pay_to_bank")}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-300">{t("payments_info.calculator.labels.total_upfront")}</div>
                            <div className="text-xl font-extrabold text-white">{Math.round(bankDerived.upfront).toLocaleString()} MMK</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {installmentMode === 'showroom' && showroomDerived && (
                      <div className="rounded-xl p-3 sm:p-4 bg-gradient-to-r from-emerald-900 to-slate-800 border border-emerald-700 shadow-lg ring-1 ring-emerald-600/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-emerald-200 font-semibold">{t("payments_info.calculator.summary.showroom_title")}</div>
                            <div className="text-sm text-slate-200">{t("payments_info.calculator.labels.includes_paperwork")}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-300">{t("payments_info.calculator.labels.total_upfront")}</div>
                            <div className="text-xl font-extrabold text-white">{Math.round(showroomDerived.upfront).toLocaleString()} MMK</div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-slate-200">{t("payments_info.calculator.labels.est_monthly")}</div>
                          <div className="text-lg font-bold text-white">{Math.round(showroomDerived.totalMonthly).toLocaleString()} MMK</div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            
          </div>

        </div>
      </main>

      <style>{`
        .premium-input {
          background: white;
          border: 1px solid #e2e8f0;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          font-weight: 500;
          transition: all 0.2s;
          outline: none;
        }
        .premium-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </div>
  );
};

/* ===== COMPONENTS ===== */

const InfoIcon = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-4 py-3 border-b border-slate-200/50">
    <div className="text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

export default PremiumPayment;
