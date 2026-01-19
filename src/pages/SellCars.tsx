import React from 'react';
import SellCarIntro from '../components/SellCarIntro';
import SellCarForm from '../components/SellCarForm';
import WhySellWithUs from '../components/WhySellWithUs';

const SellCars: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <SellCarIntro />
              </div>

              <SellCarForm />
            </div>

            <div className="lg:col-span-1">
              <WhySellWithUs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCars;
