import React from 'react';
import { useNavigate } from 'react-router-dom';

const brands = [
  { name: 'Toyota', slug: 'toyota' },
  { name: 'Suzuki', slug: 'suzuki' },
  { name: 'Honda', slug: 'honda' },
  { name: 'Lexus', slug: 'lexus' },
  { name: 'Mitsubishi', slug: 'mitsubishi' },
  { name: 'Nissan', slug: 'nissan' },
];

const ShopByBrand: React.FC = () => {
  const naivigate = useNavigate();
  return (
    // bg-slate-50 creates a physical "block" that looks different from the Featured section
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Distinct Header Style */}
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Shop by <span className="text-indigo-600">Brand</span>
          </h2>
          <div className="w-12 h-1 bg-indigo-600 mt-4 rounded-full"></div> {/* Visual underline divider */}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 items-center">
          {brands.map((brand) => (
            <button key={brand.name}
              className="flex justify-center group opacity-50 hover:opacity-100 transition-all"
              onClick={() => naivigate(`/buyCars?brand=${brand.slug}`)}
            >
              <span className="text-xl font-bold text-black group-hover:text-indigo-600 transition-colors">
                {brand.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ShopByBrand;
