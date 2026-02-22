import React from "react";
import PremiumPayment from "../components/PremiumPayment";

const Payments: React.FC = () => {
  return (
    <main className="bg-[#f8fafc] min-h-screen py-2 lg:py-3">
      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3">
        <PremiumPayment />
      </div>
    </main>
  );
};

export default Payments;