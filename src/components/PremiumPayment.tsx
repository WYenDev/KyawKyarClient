import React, { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Gem,
  Clock,
  MapPin,
  Fuel,
  Settings2,
  Wallet,
  Percent,
  ReceiptText,
  Calculator
} from "lucide-react";
import { useGetApiBankInstallments, useGetApiShowroomInstallments } from "../services/api";

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

type InstallmentMode = "bank" | "showroom";

const PremiumPayment: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(3);
  const [paymentType, setPaymentType] = useState<"full" | "installment">("installment");
  const [installmentMode, setInstallmentMode] = useState<InstallmentMode | null>(null);

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

  // When user picks "Installment" as payment type, default to showroom mode
  useEffect(() => {
    if (paymentType === 'installment' && installmentMode == null) {
      setInstallmentMode('showroom');
    }
  }, [paymentType, installmentMode]);

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
      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LEFT: INTERACTIVE FORM AREA */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-10">
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <header className="mb-10">
                      <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Step 01</span>
                      <h2 className="text-3xl font-bold mt-2">Vehicle Verification</h2>
                      <p className="text-slate-500 mt-2">Review your selected model's specialized certifications.</p>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
                        <InfoIcon icon={<Settings2 size={18} />} label="Model & Year" value={`${car.model} — ${car.modelYear}`} />
                        <InfoIcon icon={<MapPin size={18} />} label="Showroom" value={car.showroom} />
                        <InfoIcon icon={<Fuel size={18} />} label="Fuel System" value={car.fuel} />
                      </div>
                      <div className="group p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
                        <InfoIcon icon={<ShieldCheck size={18} />} label="Engine Status" value="150-Point Certified" />
                        <InfoIcon icon={<Clock size={18} />} label="Mileage" value={`${car.mileage} km (Genuine)`} />
                        <InfoIcon icon={<Gem size={18} />} label="Grade" value="S-Class Premium" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <header className="mb-10">
                      <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Step 02</span>
                      <h2 className="text-3xl font-bold mt-2">Personal Details</h2>
                      <p className="text-slate-500 mt-2">Enter ownership details for legal documentation.</p>
                    </header>
                    <div className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-slate-400 ml-1">Full Name</label>
                          <input className="premium-input w-full" placeholder="e.g. U Kyaw Zay Ya" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase text-slate-400 ml-1">Phone</label>
                          <input className="premium-input w-full" placeholder="09 xxxxxxxx" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <header className="mb-8">
                      <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Step 03</span>
                      <h2 className="text-3xl font-bold mt-2">Payment Strategy</h2>
                      <p className="text-slate-500 mt-2">Choose between full payment or tailored installment plans.</p>
                    </header>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button
                        onClick={() => {
                          setPaymentType("full");
                          setInstallmentMode(null);
                        }}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentType === "full" ? "border-blue-600 bg-blue-50 ring-4 ring-blue-50" : "border-slate-100 bg-white"}`}
                      >
                        <Wallet className={paymentType === "full" ? "text-blue-600" : "text-slate-400"} />
                        <span className="font-bold">Full Cash Pay</span>
                      </button>

                      <button
                        onClick={() => setPaymentType("installment")}
                        className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${paymentType === "installment" ? "border-blue-600 bg-blue-50 ring-4 ring-blue-50" : "border-slate-100 bg-white"}`}
                      >
                        <Percent className={paymentType === "installment" ? "text-blue-600" : "text-slate-400"} />
                        <span className="font-bold">Installment Plan</span>
                      </button>
                    </div>

                    {paymentType === "installment" && (
                      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8 space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <ReceiptText size={18} className="text-blue-600" />
                            <label className="text-sm font-bold text-slate-600 uppercase">Installment Type</label>
                          </div>
                          <div className="flex gap-2">
                            {(["showroom", "bank"] as InstallmentMode[]).map((m) => (
                              <button
                                key={m}
                                onClick={() => setInstallmentMode(m)}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${installmentMode === m ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200 shadow-sm"}`}
                              >
                                {m.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        {installmentMode === "showroom" && Array.isArray(showroomInstallments) && showroomInstallments.length > 0 && (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <ReceiptText size={18} className="text-blue-600" />
                              <label className="text-sm font-bold text-slate-600 uppercase">Choose Showroom Plan</label>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-end">
                              {showroomInstallments.map((plan, idx) => {
                                const months = Math.max(1, Math.round(Number(plan?.duration ?? 0) * 12));
                                const active = selectedShowroomIndex === idx;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => setSelectedShowroomIndex(idx)}
                                    className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${active ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200 shadow-sm"}`}
                                  >
                                    {months} MONTHS
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {installmentMode === "bank" && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <ReceiptText size={18} className="text-blue-600" />
                            <span>Bank installment: upfront per bank config, remaining processed via bank.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* FOOTER ACTIONS */}
                <div className="bg-slate-50 p-8 border-t border-slate-100 flex justify-between items-center">
                  <button
                    disabled={step === 1}
                    onClick={() => setStep((step - 1) as any)}
                    className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${step === 1 ? 'opacity-0' : 'text-slate-600 hover:bg-slate-200'}`}
                  >
                    <ChevronLeft size={20} /> Back
                  </button>

                  <button
                    onClick={() => (step < 3 ? setStep((step + 1) as any) : alert("Premium Transaction Initiated"))}
                    className={`flex items-center gap-2 font-bold px-10 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-1 ${step === 3 ? 'bg-blue-600 shadow-blue-200 text-white hover:bg-blue-700' : 'bg-slate-900 shadow-slate-200 text-white hover:bg-black'}`}
                  >
                    {step === 3 ? "Complete Purchase" : "Continue"}
                    {step < 3 && <ChevronRight size={20} />}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY CARD + CONDITIONAL CALCULATOR */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            {paymentType === "installment" && (
              <div className="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden text-white p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Calculator className="text-blue-400" size={24} />
                  <h3 className="text-lg font-bold">Installment Calculator</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vehicle Price (MMK)</label>
                    <input
                      type="number"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl font-bold text-xl text-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>

                  {!installmentMode && (
                    <p className="text-xs text-slate-400">Select an installment type to see calculations.</p>
                  )}

                  {installmentMode === "bank" && bankDerived && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300">
                        Upfront: Initial Payment {((bankConfig?.initialPayment ?? 0)).toString()}% + Deposit {((bankConfig?.deposit ?? 0)).toString()}% + Tax
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Initial Payment</span>
                        <span className="font-bold">{Math.round(bankDerived.initialPaymentAmt).toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Deposit</span>
                        <span className="font-bold">{Math.round(bankDerived.depositAmt).toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax & Registration</span>
                        <span className="font-bold">{TAX.toLocaleString()} MMK</span>
                      </div>
                      <div className="my-3 border-t border-slate-800/60" />
                      <div className="flex justify-between text-sm">
                        <span>Total Upfront</span>
                        <span className="font-black text-blue-400">{Math.round(bankDerived.upfront).toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Remaining (Bank processed)</span>
                        <span className="font-bold">{Math.round(bankDerived.remaining).toLocaleString()} MMK</span>
                      </div>
                    </div>
                  )}

                  {installmentMode === "showroom" && showroomDerived && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-300">
                        Upfront: Initial {(showroomConfig?.initialPayment ?? 0).toString()}% + Paperwork {Math.round(showroomDerived.paperworkAmt).toLocaleString()} MMK
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Initial Payment</span>
                        <span className="font-bold">{Math.round(showroomDerived.initialPaymentAmt).toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Paperwork Fee</span>
                        <span className="font-bold">{Math.round(showroomDerived.paperworkAmt).toLocaleString()} MMK</span>
                      </div>
                      <div className="my-3 border-t border-slate-800/60" />
                      <div className="flex justify-between text-sm">
                        <span>Total Upfront</span>
                        <span className="font-black text-blue-400">{Math.round(showroomDerived.upfront).toLocaleString()} MMK</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Remaining</span>
                        <span className="font-bold">{Math.round(showroomDerived.remaining).toLocaleString()} MMK</span>
                      </div>
                      <div className="my-3 border-t border-slate-800/60" />
                      <div className="flex justify-between text-sm">
                        <span>Monthly Base ({showroomDerived.months} months)</span>
                        <span className="font-bold">{showroomDerived.baseMonthly.toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Monthly Interest ({(showroomConfig?.interestRate ?? 0)}%)</span>
                        <span className="font-bold">{showroomDerived.interestMonthly.toLocaleString()} MMK</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Monthly</span>
                        <span className="font-black text-blue-400">{showroomDerived.totalMonthly.toLocaleString()} MMK</span>
                      </div>
                    </div>
                  )}

                  {/* Compact summary at end of calculator */}
                  <div className="mt-4">
                    {installmentMode === 'bank' && bankDerived && (
                      <div className="rounded-xl p-4 bg-gradient-to-r from-blue-900 to-slate-800 border border-blue-700 shadow-lg ring-1 ring-blue-600/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-blue-200 font-semibold">Bank — Upfront</div>
                            <div className="text-sm text-slate-200">Pay to bank upfront</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-300">Total Upfront</div>
                            <div className="text-xl font-extrabold text-white">{Math.round(bankDerived.upfront).toLocaleString()} MMK</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {installmentMode === 'showroom' && showroomDerived && (
                      <div className="rounded-xl p-4 bg-gradient-to-r from-emerald-900 to-slate-800 border border-emerald-700 shadow-lg ring-1 ring-emerald-600/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-emerald-200 font-semibold">Showroom — Summary</div>
                            <div className="text-sm text-slate-200">Includes paperwork (excl. tax)</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-300">Upfront</div>
                            <div className="text-xl font-extrabold text-white">{Math.round(showroomDerived.upfront).toLocaleString()} MMK</div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm text-slate-200">Est. Monthly</div>
                          <div className="text-lg font-bold text-white">{Math.round(showroomDerived.totalMonthly).toLocaleString()} MMK</div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}
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
