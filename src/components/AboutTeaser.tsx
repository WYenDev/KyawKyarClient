import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useGetApiAbout } from '../services/api';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop',
];

const AboutTeaser: React.FC = () => {
  const { data: aboutData } = useGetApiAbout();
  const aboutImages = (aboutData?.images ?? []).slice().sort((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0));

  const img = (index: number, className = 'rounded-lg shadow-lg w-full h-auto object-cover aspect-square') => {
    const src = aboutImages[index]?.url ?? FALLBACK_IMAGES[index] ?? '';
    const alt = `About image ${index}`;
    return <img src={src} alt={alt} className={className} />;
  };

  return (
    <section className="bg-transparent py-2 lg:py-3 relative overflow-hidden">
      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3">
        <div className="bg-white rounded-none p-3 sm:p-6 lg:p-10 shadow-2xl shadow-slate-200/40 border border-white relative overflow-hidden">
          <div className="grid md:grid-cols-2 items-center gap-8 md:gap-16 relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {img(0, 'rounded-none shadow-lg w-full h-auto object-cover aspect-square')}
                {img(1, 'rounded-none shadow-lg w-full h-auto object-cover aspect-square')}
              </div>
              <div className="space-y-4 mt-8">
                {img(2, 'rounded-none shadow-lg w-full h-auto object-cover aspect-square')}
                {img(3, 'rounded-none shadow-lg w-full h-auto object-cover aspect-square')}
              </div>
            </div>
            <div className="py-4">
              <h3 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-3">About KyawKyar</h3>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Your Trusted Multi-Brand Car Showroom in Myanmar</h2>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                We hand-select every vehicle, perform rigorous inspections, and support you through financing and ownership transfer. Discover our commitment to quality and customer satisfaction.
              </p>
              <Link to="/about" className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-none font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 group">
                Learn More About Us
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
