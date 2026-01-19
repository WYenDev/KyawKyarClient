import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AboutTeaser: React.FC = () => {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 items-center gap-8 md:gap-16">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop" alt="Sports car" className="rounded-lg shadow-lg w-full h-auto object-cover aspect-square" />
              <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop" alt="Classic car" className="rounded-lg shadow-lg w-full h-auto object-cover aspect-square" />
            </div>
            <div className="space-y-4 mt-8">
              <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop" alt="Luxury car" className="rounded-lg shadow-lg w-full h-auto object-cover aspect-square" />
              <img src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop" alt="Modern car" className="rounded-lg shadow-lg w-full h-auto object-cover aspect-square" />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">About KyawKyar</h3>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">Your Trusted Multi-Brand Car Showroom in Myanmar</h2>
            <p className="text-slate-600 mb-8 text-lg">
              We hand-select every vehicle, perform rigorous inspections, and support you through financing and ownership transfer. Discover our commitment to quality and customer satisfaction.
            </p>
            <Link to="/about" className="inline-flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all group">
              Learn More About Us
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
