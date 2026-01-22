import React, { useState } from "react";
import {
  ShieldCheck,
  Truck,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Gem,
  Clock,
  MapPin,
  Fuel,
  Settings2,
  Wallet,
  Percent,
  ReceiptText,
  Calculator // Added for the calculator header
} from "lucide-react";

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
const DELIVERY_FEE = 300000;

const PremiumPayment: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(3);
  const [delivery, setDelivery] = useState(false);
  const [paymentType, setPaymentType] = useState<"full" | "installment">("installment");
  const [installmentMonth, setInstallmentMonth] = useState(36);

  /* ===== NEW: Calculator State ===== */
  const [customPrice, setCustomPrice] = useState(car.price);

  /* ===== Financial Calculations ===== */
  const downpaymentPercent = 0.30;
  const downpaymentAmount = customPrice * downpaymentPercent;
  const loanAmount = customPrice - downpaymentAmount;
  const interestRate = 0.05; // 5% annual
  const monthlyPayment = Math.round((loanAmount + (loanAmount * interestRate * (installmentMonth / 12))) / installmentMonth);

  const initialTotal = downpaymentAmount + TAX + (delivery ? DELIVERY_FEE : 0);
  const fullTotal = customPrice + TAX + (delivery ? DELIVERY_FEE : 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Gem size={22} />
            </div>
            <span className="text-xl font-bold tracking-tight italic">PREMIER MOTORS</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Step label="Vehicle Selection" active={step === 1} done={step > 1} num={1} />
            <Step label="Concierge Details" active={step === 2} done={step > 2} num={2} />
            <Step label="Secure Payment" active={step === 3} done={false} num={3} />
          </div>
        </div>
      </nav>

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

                    {/* INTERACTIVE CALCULATOR SECTION */}
                    <div className="mb-8 p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
                      <div className="flex items-center gap-3 mb-6">
                        <Calculator className="text-blue-400" size={24} />
                        <h3 className="text-lg font-bold">Loan Value Calculator</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adjust Vehicle Price (MMK)</label>
                          <input
                            type="number"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(Number(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl font-bold text-xl text-blue-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          />
                          <input
                            type="range"
                            min="10000000"
                            max="200000000"
                            step="1000000"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <button
                        onClick={() => setPaymentType("full")}
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
                            <label className="text-sm font-bold text-slate-600 uppercase">Payment Duration</label>
                          </div>
                          <div className="flex gap-2">
                            {[36, 60, 84].map(m => (
                              <button
                                key={m}
                                onClick={() => setInstallmentMonth(m)}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${installmentMonth === m ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200 shadow-sm"}`}
                              >
                                {m / 12} YEARS
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">30% Downpayment</p>
                            <p className="text-lg font-bold text-slate-800">{downpaymentAmount.toLocaleString()} MMK</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly Installment</p>
                            <p className="text-lg font-bold text-blue-600">{monthlyPayment.toLocaleString()} MMK</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setDelivery(!delivery)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-between mb-8 ${delivery ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${delivery ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Truck size={24} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold">Home Delivery Service</p>
                          <p className="text-sm text-slate-500">Secure transport to your doorstep</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">+{DELIVERY_FEE.toLocaleString()} MMK</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

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
                  onClick={() => step < 3 ? setStep((step + 1) as any) : alert("Premium Transaction Initiated")}
                  className={`flex items-center gap-2 font-bold px-10 py-4 rounded-2xl shadow-xl transition-all hover:-translate-y-1 ${step === 3 ? 'bg-blue-600 shadow-blue-200 text-white hover:bg-blue-700' : 'bg-slate-900 shadow-slate-200 text-white hover:bg-black'}`}
                >
                  {step === 3 ? "Complete Purchase" : "Continue"}
                  {step < 3 && <ChevronRight size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: SUMMARY CARD */}
          <div className="lg:col-span-4 sticky top-28">
            <div className="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden text-white p-8">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <CheckCircle2 className="text-blue-400" /> Order Summary
              </h3>
              <div className="space-y-5">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Vehicle Model</span>
                  <span className="text-white font-medium">{car.model}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Pricing Method</span>
                  <span className="text-blue-400 font-bold uppercase tracking-tighter">{paymentType}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Base Price</span>
                  <span className="text-white font-medium">{customPrice.toLocaleString()} MMK</span>
                </div>
                {paymentType === "installment" && (
                  <div className="flex justify-between text-slate-400 text-sm">
                    <span>Downpayment</span>
                    <span className="text-white font-medium">-{downpaymentAmount.toLocaleString()} MMK</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Tax & Registration</span>
                  <span className="text-white font-medium">{TAX.toLocaleString()} MMK</span>
                </div>
                {delivery && (
                  <div className="flex justify-between text-blue-400 text-sm">
                    <span>Priority Delivery</span>
                    <span className="font-medium">+{DELIVERY_FEE.toLocaleString()} MMK</span>
                  </div>
                )}
              </div>

              <div className="my-8 border-t border-slate-800 border-dashed" />

              <div className="space-y-2">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  {paymentType === "installment" ? "Due Today" : "Final Total"}
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black text-blue-400 leading-none">
                    {(paymentType === "installment" ? initialTotal : fullTotal).toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-slate-500">MMK</span>
                </div>
                {paymentType === "installment" && (
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">
                    Future: {monthlyPayment.toLocaleString()} MMK x {installmentMonth} Months
                  </p>
                )}
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

const Step = ({ label, active, done, num }: { label: string; active: boolean; done: boolean; num: number }) => (
  <div className="flex items-center gap-3">
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${active ? "bg-blue-600 border-blue-600 text-white" :
      done ? "bg-green-500 border-green-500 text-white" : "bg-white border-slate-200 text-slate-400"
      }`}>
      {done ? <CheckCircle2 size={14} /> : num}
    </div>
    <span className={`text-sm font-bold ${active ? "text-slate-900" : "text-slate-400"}`}>{label}</span>
  </div>
);

const InfoIcon = ({ icon, label, value }: { icon: React.ReactNode, label: string; value: string }) => (
  <div className="flex items-center gap-4 py-3 border-b border-slate-200/50">
    <div className="text-slate-400">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

export default PremiumPayment;