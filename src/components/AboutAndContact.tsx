import React, { useState, useRef, useEffect } from 'react';
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

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Calculate the visibility percentage of each image
  const getImageVisibility = (index: number) => {
    if (!scrollContainerRef.current || !containerRef.current) return 0;

    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;

    // Each image occupies 100% of container width + gap
    const imageStart = index * (container.clientWidth + 16); // 16px gap
    const imageEnd = imageStart + container.clientWidth;
    const scrollPosition = scrollContainer.scrollLeft;
    const viewportStart = scrollPosition;
    const viewportEnd = scrollPosition + container.clientWidth;

    // Calculate overlap
    const overlapStart = Math.max(imageStart, viewportStart);
    const overlapEnd = Math.min(imageEnd, viewportEnd);
    const overlap = Math.max(0, overlapEnd - overlapStart);

    // Calculate visibility percentage
    const visibility = overlap / container.clientWidth;

    return Math.max(0, Math.min(1, visibility));
  };

  // Update active index based on which image is most visible
  const updateActiveImage = () => {
    if (!scrollContainerRef.current || !containerRef.current || isScrolling.current) return;

    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    const scrollPosition = scrollContainer.scrollLeft;
    const viewportCenter = scrollPosition + (container.clientWidth / 2);

    // Find which image's center is closest to viewport center
    let newActiveIndex = 0;
    let smallestDistance = Infinity;

    aboutImages.forEach((_, index) => {
      const imageCenter = (index * (container.clientWidth + 16)) + (container.clientWidth / 2);
      const distance = Math.abs(viewportCenter - imageCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        newActiveIndex = index;
      }
    });

    if (newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex);
    }
  };

  // Scroll to specific image
  const scrollToImage = (index: number) => {
    if (!scrollContainerRef.current || !containerRef.current) return;

    isScrolling.current = true;

    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    const scrollPosition = index * (container.clientWidth + 16);

    scrollContainer.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    // Reset scrolling flag
    setTimeout(() => {
      isScrolling.current = false;
    }, 300);
  };

  // Handle scroll events
  const handleScroll = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      updateActiveImage();
    }, 50);
  };

  // Initialize
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [aboutImages.length]);

  // Scroll to initial image
  useEffect(() => {
    if (aboutImages.length > 0) {
      setTimeout(() => {
        scrollToImage(0);
      }, 100);
    }
  }, []);

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
      <section id="about" className="py-16 sm:py-24">
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid xl:grid-cols-2 gap-12 xl:gap-24 items-center">
            {/* Modern Image Layout: Single Viewport Gallery (Mobile) | Asymmetric Bento (Desktop) */}
            <div className="relative w-full z-10">

              {/* MOBILE VIEW: Single Viewport Gallery */}
              <div className="xl:hidden w-full py-8">
                <div className="relative">
                  {/* Fixed Viewport Container */}
                  <div
                    ref={containerRef}
                    className="relative w-full h-[70vh] max-h-[600px] overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-200/50 bg-slate-50"
                  >
                    {/* Scrollable Container with all images */}
                    <div
                      ref={scrollContainerRef}
                      className="absolute inset-0 flex flex-nowrap overflow-x-auto no-scrollbar"
                      style={{
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch'
                      }}
                    >
                      {aboutImages.map((img, index) => {
                        const visibility = getImageVisibility(index);
                        const isActive = index === activeIndex;

                        return (
                          <div
                            key={`m-${index}`}
                            className="flex-none relative h-full transition-all duration-300 ease-out"
                            style={{
                              width: 'calc(100% - 8px)',
                              marginRight: index === aboutImages.length - 1 ? '0' : '16px'
                            }}
                          >
                            {/* Main Image Container */}
                            <div
                              className="relative w-full h-full overflow-hidden rounded-[2rem] transition-all duration-300 ease-out"
                              style={{
                                transform: isActive
                                  ? 'scale(1)'
                                  : `scale(${0.9 + (visibility * 0.1)})`,
                                opacity: isActive ? 1 : 0.7 + (visibility * 0.3),
                                filter: isActive
                                  ? 'brightness(1)'
                                  : `brightness(${0.8 + (visibility * 0.2)})`,
                                boxShadow: isActive
                                  ? '0 20px 40px rgba(0,0,0,0.15)'
                                  : `0 10px 20px rgba(0,0,0,${0.05 + (visibility * 0.1)})`
                              }}
                            >
                              <img
                                src={img.url}
                                alt={`Kyaw Kyar Showroom ${index + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                              />

                              {/* Overlay for non-active images */}
                              {!isActive && (
                                <div
                                  className="absolute inset-0 bg-black/30 transition-opacity duration-300"
                                  style={{
                                    opacity: 1 - visibility
                                  }}
                                />
                              )}

                              {/* Active Indicator */}
                              {isActive && (
                                <div className="absolute bottom-6 left-6 right-6">
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-bold text-slate-900">
                                      Viewing • {index + 1} of {aboutImages.length}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Click target for navigation */}
                            <button
                              onClick={() => scrollToImage(index)}
                              className="absolute inset-0 z-10"
                              aria-label={`View image ${index + 1}`}
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* REMOVED: Gradient overlays for edges */}
                    {/* <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none z-20" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none z-20" /> */}

                    {/* Navigation arrows */}
                    {activeIndex > 0 && (
                      <button
                        onClick={() => scrollToImage(activeIndex - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                        aria-label="Previous image"
                      >
                        <div className="w-6 h-6 flex items-center justify-center text-slate-700">
                          ←
                        </div>
                      </button>
                    )}

                    {activeIndex < aboutImages.length - 1 && (
                      <button
                        onClick={() => scrollToImage(activeIndex + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                        aria-label="Next image"
                      >
                        <div className="w-6 h-6 flex items-center justify-center text-slate-700">
                          →
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Image Counter & Navigation */}
                  <div className="mt-8 px-4">
                    <div className="flex items-center justify-between">
                      {/* Dots Navigation */}
                      <div className="flex items-center gap-2">
                        {aboutImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => scrollToImage(index)}
                            className={`
                              rounded-full transition-all duration-300
                              ${index === activeIndex
                                ? 'w-8 h-2 bg-indigo-600'
                                : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                              }
                            `}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>

                      {/* Current Image Info */}
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          <span className="text-indigo-600">{activeIndex + 1}</span>
                          <span className="text-slate-400"> / {aboutImages.length}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Scroll or click arrows to navigate
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scroll Indicator */}
                  <div className="mt-4 px-4">
                    <div className="relative h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full transition-all duration-300"
                        style={{
                          width: `${((activeIndex + 1) / aboutImages.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* DESKTOP VIEW: Asymmetric Bento Grid */}
              <div className="hidden xl:grid grid-cols-2 gap-8">
                {aboutImages.map((img, i) => (
                  <div
                    key={`d-${i}`}
                    className={`w-full transition-all duration-500 group/img ${i % 2 !== 0 ? 'mt-16' : ''}`}
                  >
                    <div className="relative overflow-hidden rounded-[3rem] shadow-2xl shadow-slate-200/50">
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
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-slate-50 rounded-none group-hover/item:bg-indigo-50 transition-colors">
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
              <div className="bg-white rounded-none p-8 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-none -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150 opacity-50" />

                <h3 className="font-bold text-xl text-slate-900 mb-6 relative">Instant Support</h3>
                <div className="grid gap-4 relative">
                  <a
                    href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                    className="flex items-center justify-between gap-3 bg-slate-900 text-white pl-6 pr-4 py-4 rounded-none font-bold hover:bg-slate-800 transition-all group/btn"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-none">
                        <Phone size={20} />
                      </div>
                      <span className="text-[15px]">Call Sales Team</span>
                    </div>
                    <ArrowUpRight size={20} className="text-slate-500 group-hover/btn:text-white transition-colors" />
                  </a>

                  <a
                    href={`viber://chat?number=%2B${viberNumber}`}
                    className="flex items-center justify-between gap-3 bg-white border-2 border-[#7360f2] text-[#7360f2] pl-6 pr-4 py-4 rounded-none font-bold hover:bg-[#7360f2] hover:text-white transition-all group/viber"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center bg-[#7360f2]/10 rounded-none group-hover/viber:bg-white/20 transition-colors">
                        <MessageCircle size={20} />
                      </div>
                      <span className="text-[15px]">Chat on Viber</span>
                    </div>
                    <ArrowUpRight size={20} className="text-[#7360f2]/40 group-hover/viber:text-white transition-colors" />
                  </a>
                </div>
              </div>

              {/* Premium FAQ Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-none p-8 text-white relative overflow-hidden">
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
                      <div className="w-14 h-14 shrink-0 flex items-center justify-center bg-indigo-50 rounded-none group-hover:bg-indigo-600 transition-colors duration-500">
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
                        className="flex items-center gap-2 px-5 py-3 rounded-none bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
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
                        className="flex items-center justify-between gap-3 w-full p-4 bg-slate-50 rounded-none text-slate-800 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all group/phone"
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
      </section>    </div>
  );
};

export default AboutContact;
