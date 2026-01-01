import React from 'react';
import { ShieldCheck, BadgeCheck, Banknote, History, Zap, Contact } from 'lucide-react';

const WhyBuyAtKyawKyar: React.FC = () => {
  const benefits = [
    {
      title: "150-Point Inspection",
      description: "Every vehicle is rigorously tested for engine, body, and electronics quality before it enters our showroom.",
      icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
      bg: "bg-indigo-50"
    },
    {
      title: "Flexible Financing",
      description: "Partnered with major banks (AYA, CB, KBZ) to offer you the lowest down payments and monthly installments.",
      icon: <Banknote className="w-8 h-8 text-emerald-600" />,
      bg: "bg-emerald-50"
    },
    {
      title: "Clean History Only",
      description: "We strictly avoid auction-grade cars with accidental histories. What you see is genuine quality.",
      icon: <History className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-50"
    },
    {
      title: "Swift Processing",
      description: "Documentation and ownership transfers are handled by our experts. Drive home your new car in 24 hours.",
      icon: <Zap className="w-8 h-8 text-amber-600" />,
      bg: "bg-amber-50"
    },
    {
      title: "Certified Luxury",
      description: "Our high-end models come with specialized international certifications and maintenance history.",
      icon: <BadgeCheck className="w-8 h-8 text-violet-600" />,
      bg: "bg-violet-50"
    },
    {
      title: "24/7 Support",
      description: "Our relationship doesn't end at the sale. Our customer service team is always here for your questions.",
      icon: <Contact className="w-8 h-8 text-rose-600" />,
      bg: "bg-rose-50"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">
            The KyawKyar Standard
          </h2>
          <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            Experience the Confidence of <span className="text-indigo-600">Certified Quality</span>
          </h3>
          <p className="text-slate-600 text-lg">
            We don't just sell cars; we sell peace of mind. Every vehicle in our multi-brand showroom is hand-selected to meet our high standards of safety and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`${benefit.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {benefit.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                {benefit.title}
              </h4>
              <p className="text-slate-500 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBuyAtKyawKyar;
