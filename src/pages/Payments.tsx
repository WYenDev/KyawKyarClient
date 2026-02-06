import React from "react";
import PremiumPayment from "../components/PremiumPayment";

const Payments: React.FC = () => {
  return (
    <main className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <PremiumPayment />
      </div>
    </main>
  );
};

export default Payments;