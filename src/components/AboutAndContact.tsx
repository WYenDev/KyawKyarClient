import React from 'react';
import {
  Award, Shield, Users, Clock, Phone,
  MessageCircle, MapPin, ArrowUpRight, HelpCircle, ArrowRight
} from 'lucide-react';
import { useGetApiShowrooms, useGetApiAbout, useGetApiHome } from '../services/api';
import { useTranslation } from 'react-i18next';

const AboutContact: React.FC = () => {
  const { t, i18n } = useTranslation('about');
  const isMyanmar = i18n?.language?.startsWith('mm');

  const { data: aboutData } = useGetApiAbout();
  const aboutImages = (aboutData?.images ?? []).slice().sort((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0));

  const { data: homeData } = useGetApiHome();
  const apiPhone = homeData?.phoneNo ?? undefined;
  const apiViber = homeData?.viberNo ?? undefined;
  const phoneNumber = (apiPhone ?? '+959123456789').toString();
  const viberNumber = (apiViber ?? import.meta.env.VITE_VIBER_NUMBER ?? '').toString().replace(/\s/g, '').replace(/^\+/, '');

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
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid xl:grid-cols-2 gap-12 xl:gap-24 items-center">
            {/* Modern Image Layout: Snap Reel (Mobile) | Asymmetric Bento (Desktop) */}
            <div className="relative w-full">
              <div className="flex xl:grid xl:grid-cols-2 gap-6 overflow-x-auto xl:overflow-visible no-scrollbar snap-x snap-mandatory -mx-4 px-4 xl:mx-0 xl:px-0 pb-8 xl:pb-0 scroll-smooth touch-pan-x">
                {aboutImages.map((img, i) => (
                  <div 
                    key={i} 
                    className={`flex-shrink-0 w-[80vw] sm:w-80 xl:w-full snap-center xl:snap-none transition-all duration-500 group/img
                                ${i % 2 !== 0 ? 'xl:mt-16' : ''}`}
                  >
                    <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-slate-200/50">
                      <img
                        src={img.url}
                        alt={`Kyaw Kyar Showroom ${i}`}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110
                                    ${i === 0 || i === 3 ? 'aspect-[4/5]' : 'aspect-square'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Mobile Interaction Hint */}
              <div className="xl:hidden flex items-center justify-between px-2 mt-4">
                <div className="flex gap-1.5">
                  <div className="w-8 h-1.5 bg-indigo-600 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                  Swipe to explore
                </span>
              </div>
            </div>

            {/* Text Side */}
            <div className="space-y-10">
              <div>
                <span className="text-indigo-600 font-bold tracking-[0.2em] text-xs uppercase mb-4 inline-block">
                  {isMyanmar ? 'ကျွန်ုပ်တို့၏ အကြောင်းအရင်း' : 'Our Story & Legacy'}
                </span>
                <h2 className={`text-4xl lg:text-5xl font-black text-slate-900 leading-tight ${isMyanmar ? 'font-myanmar sm:leading-[1.4] max-sm:text-[2.2rem] pt-2' : ''}`}>
                  {t('about.title')}
                </h2>
              </div>

              <p className={`text-lg text-slate-500 leading-relaxed ${isMyanmar ? 'font-myanmar leading-[1.8] text-[1.05rem]' : ''}`}>
                {t('about.description')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
                {[
                  { icon: <Award className="text-indigo-600" />, title: t('about.features.quality.title'), desc: t('about.features.quality.desc') },
                  { icon: <Shield className="text-emerald-600" />, title: t('about.features.warranty.sellBack'), desc: t('about.features.warranty.desc') },
                  { icon: <Users className="text-blue-600" />, title: t('about.features.expert.title'), desc: t('about.features.expert.desc') },
                  { icon: <Clock className="text-amber-600" />, title: t('about.features.fast.title'), desc: t('about.features.fast.desc') },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group/item">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-slate-50 rounded-2xl group-hover/item:bg-indigo-50 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold text-slate-900 mb-1 ${isMyanmar ? 'font-myanmar text-sm' : ''}`}>{item.title}</h4>
                      <p className={`text-sm text-slate-500 leading-relaxed ${isMyanmar ? 'font-myanmar text-xs leading-5' : ''}`}>{item.desc}</p>
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
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-3 inline-block">
              {t('contact.title')}
            </span>
            <h2 className={`text-3xl lg:text-4xl font-black text-slate-900 leading-tight ${isMyanmar ? 'font-myanmar sm:leading-relaxed max-sm:text-[2.2rem]' : ''}`}>
              {t('contact.subtitle')}
            </h2>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">

              {t('contact.description')}
            </p>
          </div>

          <div className="grid xl:grid-cols-3 gap-8 items-start">
            {/* Left Column: Contact Actions */}
            {/* Left Column: Interactive Contact Experience */}
            <div className="xl:col-span-1 space-y-8 xl:sticky xl:top-24 h-fit">
              {/* Direct Actions Card */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150 opacity-50" />
                
                <h3 className="font-bold text-xl text-slate-900 mb-6 relative">Instant Support</h3>
                <div className="grid gap-4 relative">
                  <a
                    href={`tel:${phoneNumber.replace(/\s/g, '')}` }
                    className="flex items-center justify-between gap-3 bg-slate-900 text-white pl-6 pr-4 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all group/btn"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl">
                        <Phone size={20} />
                      </div>
                      <span className="text-[15px]">Call Sales Team</span>
                    </div>
                    <ArrowUpRight size={20} className="text-slate-500 group-hover/btn:text-white transition-colors" />
                  </a>
                  
                  <a
                    href={`viber://chat?number=%2B${viberNumber}`}
                    className="flex items-center justify-between gap-3 bg-white border-2 border-[#7360f2] text-[#7360f2] pl-6 pr-4 py-4 rounded-2xl font-bold hover:bg-[#7360f2] hover:text-white transition-all group/viber"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-[#7360f2]/10 rounded-xl group-hover/viber:bg-white/20 transition-colors">
                        <MessageCircle size={20} />
                      </div>
                      <span className="text-[15px]">Chat on Viber</span>
                    </div>
                    <ArrowUpRight size={20} className="text-[#7360f2]/40 group-hover/viber:text-white transition-colors" />
                  </a>
                </div>
              </div>

              {/* Premium FAQ Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200/50 relative overflow-hidden">
                <HelpCircle className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 -rotate-12" />
                
                <h4 className="font-bold text-xl flex items-center gap-2 mb-6">
                  Quick Answers
                </h4>
                <div className="grid gap-6 relative">
                  {[
                    { q: "Looking for a specific model?", a: "Ask about upcoming stock and pre-orders." },
                    { q: "Need a trade-in value?", a: "Visit any branch for a free valuation." },
                    { q: "Finance questions?", a: "We provide instant calculations." }
                  ].map((item, i) => (
                    <div key={i} className="group/q cursor-default">
                      <p className="text-[15px] font-bold text-indigo-100 group-hover/q:text-white transition-colors">{item.q}</p>
                      <p className="text-sm text-indigo-200/80 leading-relaxed mt-1">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Branch Cards */}
            <div className="xl:col-span-2 grid gap-8">
              {showroomData.items && showroomData.items.map((loc: any, i: number) => (
                <div
                  key={i}
                  className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 transition-all hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/40 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div className="flex gap-5">
                      <div className="w-14 h-14 shrink-0 flex items-center justify-center bg-indigo-50 rounded-2xl group-hover:bg-indigo-600 transition-colors duration-500">
                        <MapPin className="text-indigo-600 group-hover:text-white w-6 h-6 transition-colors duration-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className={`font-bold text-slate-900 text-xl ${isMyanmar ? 'font-myanmar pt-1' : ''}`}>{loc.city}</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-wider">
                            Showroom
                          </span>
                        </div>
                        <p className={`text-sm text-slate-500 leading-relaxed max-w-md ${isMyanmar ? 'font-myanmar leading-loose text-base' : ''}`}>
                          {isMyanmar ? loc.addressMm : loc.addressEn}
                        </p>
                      </div>
                    </div>
                    {loc.googleMapUrl && (
                      <button
                        onClick={() => window.open(loc.googleMapUrl!, '_blank')}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                      >
                        <ArrowUpRight size={18} />
                        View Location
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                    {loc.phones && loc.phones.length > 0 && loc.phones.map((phone: any) => (
                      <a
                        key={phone.phone}
                        href={`tel:${phone.phone.replace(/\s/g, '')}`}
                        className="flex items-center justify-between gap-3 w-full p-4 bg-slate-50 rounded-2xl text-slate-800 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all group/phone"
                      >
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-slate-400 group-hover/phone:text-indigo-600" />
                          {phone.phone}
                        </div>
                        <ArrowRight size={14} className="opacity-0 group-hover/phone:opacity-100 translate-x-[-10px] group-hover/phone:translate-x-0 transition-all" />
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
