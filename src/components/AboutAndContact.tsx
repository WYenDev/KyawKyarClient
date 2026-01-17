import React from 'react';
import {
  Award, Shield, Users, Clock, Phone,
  MessageCircle, MapPin, ArrowUpRight, HelpCircle
} from 'lucide-react';
import AboutImage from '../assets/about.jpg';
import { useGetApiShowrooms } from '../services/api';
import { useTranslation } from 'react-i18next';

const AboutContact: React.FC = () => {
  const viberNumber = import.meta.env.VITE_VIBER_NUMBER; // General Inquiry Viber
  const { t, i18n } = useTranslation('about'); // Use 'common' namespace


  const { data: showroomData, isLoading, isError } = useGetApiShowrooms()

  if (isLoading) {
    return <div>Loading showroom data...</div>;
  }


  if (!showroomData || isError) {
    return <div>Failed to load showroom data.</div>;
  }

  return (
    <div className="bg-white">
      {/* --- SECTION 1: ABOUT US --- */}
      <section id="about" className="py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Collage */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-16954405a255?q=80&w=800&auto=format&fit=crop"
                  alt="Showroom Interior"
                  className="rounded-2xl shadow-lg w-full h-auto object-cover aspect-[4/5]"
                />
                <img 
                  src="https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=800&auto=format&fit=crop"
                  alt="Our Team"
                  className="rounded-2xl shadow-lg w-full h-auto object-cover aspect-square"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1517999144091-3d9dca6d1649?q=80&w=800&auto=format&fit=crop"
                  alt="Customer Service"
                  className="rounded-2xl shadow-lg w-full h-auto object-cover aspect-square"
                />
                <img 
                  src={AboutImage}
                  alt="KyawKyar Luxury Car"
                  className="rounded-2xl shadow-lg w-full h-auto object-cover aspect-[4/5]"
                />
              </div>
            </div>

            {/* Text Side */}
            <div className="space-y-8">
              <div>
                <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-3 inline-block">
                  Our Legacy
                </span>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  {t('title')} <br />
                  <span className="text-indigo-600">{t("title_suffix")}</span>
                </h2>
              </div>

              <p className="text-lg text-slate-500 leading-relaxed">
                {t('description')}
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                {[
                  { icon: <Award className="text-indigo-600" />, title: "Quality Assured", desc: "150-point check" },
                  { icon: <Shield className="text-emerald-600" />, title: "Warranty", desc: "6-month guarantee" },
                  { icon: <Users className="text-blue-600" />, title: "Expert Team", desc: "Professional staff" },
                  { icon: <Clock className="text-amber-600" />, title: "Fast Process", desc: "Quick ownership" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: CONTACT & BRANCHES --- */}
      <section id="contact" className="py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-3 inline-block">
              Get In Touch
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Let's Get You On The Road
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Our team is ready to assist you. Reach out via your preferred method or visit us at one of our showroom locations.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Contact Actions */}
            <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-10">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 mb-4">Direct Contact</h3>
                <div className="flex flex-col gap-4">
                  <a
                    href="tel:+959123456789"
                    className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-lg font-bold hover:bg-slate-800 transition-all group"
                  >
                    <Phone size={18} />
                    Call Sales Team
                  </a>
                  <a
                    href={`viber://chat?number=%2B${viberNumber}`}
                    className="flex-1 flex items-center justify-center gap-3 bg-[#7360f2] text-white px-6 py-4 rounded-lg font-bold hover:bg-[#6654e0] transition-all"
                  >
                    <MessageCircle size={18} />
                    Chat on Viber
                  </a>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
                  <HelpCircle className="text-indigo-600 w-5 h-5" />
                  Quick Answers
                </h4>
                <div className="grid gap-4">
                  {[
                    { q: "Looking for a specific model?", a: "Ask about upcoming stock and pre-orders." },
                    { q: "Need a trade-in value?", a: "Visit any branch for a free valuation." },
                    { q: "Finance questions?", a: "We provide instant calculations." }
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-slate-800">{item.q}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Branch Cards */}
            <div className="lg:col-span-2 grid gap-6">
              {showroomData.items && showroomData.items.map((loc: any, i: number) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl p-6 border border-slate-100 transition-all hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <MapPin className="text-indigo-600 w-6 h-6 mt-1" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{loc.city}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-md">
                          {loc.addressEn}
                        </p>
                      </div>
                    </div>
                    {loc.googleMapUrl && (
                      <button
                        onClick={() => window.open(loc.googleMapUrl!, '_blank')}
                        className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                        title="View on Map"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                    {loc.phones && loc.phones.length > 0 && loc.phones.map((phone: any) => (
                      <a
                        key={phone.phone}
                        href={`tel:${phone.phone.replace(/\s/g, '')}`}
                        className="flex items-center justify-center gap-3 w-full py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold text-sm hover:bg-slate-900 hover:text-white transition-all"
                      >
                        <Phone size={16} />
                        {phone.phone}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutContact;
