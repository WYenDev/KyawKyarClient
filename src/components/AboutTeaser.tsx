import React, { useState, useRef, useEffect } from 'react';
import { Facebook, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetApiAbout, useGetApiHome } from '../services/api';
import ViberIcon from '../assets/viber-icon.avif';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop',
];

const AboutTeaser: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const isMyanmar = i18n?.language?.startsWith('mm');
  const { data: aboutData } = useGetApiAbout();
  const aboutImages = (aboutData?.images ?? [])
    .slice()
    .sort((a, b) => (a.sequenceNumber ?? 0) - (b.sequenceNumber ?? 0))
    .map((img, i) => ({ url: img.url ?? FALLBACK_IMAGES[i] ?? '' }));

  const { data: homeData } = useGetApiHome();
  const apiPhone = homeData?.phoneNo ?? undefined;
  const apiViber = homeData?.viberNo ?? undefined;
  const apiFacebook = homeData?.facebookLink ?? undefined;
  const phoneNumber = (apiPhone ?? '').toString();
  const viberNumber = (apiViber ?? '').toString().replace(/\s/g, '').replace(/^\+/, '');

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const getImageVisibility = (index: number) => {
    if (!scrollContainerRef.current || !containerRef.current) return 0;
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    const imageStart = index * (container.clientWidth + 16);
    const imageEnd = imageStart + container.clientWidth;
    const scrollPosition = scrollContainer.scrollLeft;
    const viewportStart = scrollPosition;
    const viewportEnd = scrollPosition + container.clientWidth;
    const overlapStart = Math.max(imageStart, viewportStart);
    const overlapEnd = Math.min(imageEnd, viewportEnd);
    const overlap = Math.max(0, overlapEnd - overlapStart);
    const visibility = overlap / container.clientWidth;
    return Math.max(0, Math.min(1, visibility));
  };

  const updateActiveImage = () => {
    if (!scrollContainerRef.current || !containerRef.current || isScrolling.current) return;
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    const scrollPosition = scrollContainer.scrollLeft;
    const viewportCenter = scrollPosition + container.clientWidth / 2;

    let newActiveIndex = 0;
    let smallestDistance = Infinity;

    aboutImages.forEach((_, index) => {
      const imageCenter = index * (container.clientWidth + 16) + container.clientWidth / 2;
      const distance = Math.abs(viewportCenter - imageCenter);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        newActiveIndex = index;
      }
    });

    if (newActiveIndex !== activeIndex) setActiveIndex(newActiveIndex);
  };

  const scrollToImage = (index: number) => {
    if (!scrollContainerRef.current || !containerRef.current) return;
    isScrolling.current = true;
    const container = containerRef.current;
    const scrollContainer = scrollContainerRef.current;
    const scrollPosition = index * (container.clientWidth + 16);
    scrollContainer.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    setTimeout(() => {
      isScrolling.current = false;
    }, 300);
  };

  const handleScroll = () => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      updateActiveImage();
    }, 50);
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [aboutImages.length]);

  useEffect(() => {
    if (aboutImages.length > 0) {
      setTimeout(() => {
        scrollToImage(0);
      }, 100);
    }
  }, []);

  return (
    <section className="bg-transparent py-2 lg:py-3 relative overflow-hidden">
      <div className="max-w-[1850px] mx-auto px-1 sm:px-2 lg:px-3">
        <div className="bg-white rounded-none p-3 sm:p-6 lg:p-10 shadow-2xl shadow-slate-200/40 border border-white relative overflow-hidden">
          <div className="grid md:grid-cols-2 items-center gap-8 md:gap-16 relative z-10">
            {/* Image Side: Mobile viewport gallery + Desktop bento grid */}
            <div className="relative w-full z-10 order-2 md:order-1">
              {/* MOBILE VIEW */}
              <div className="xl:hidden w-full py-2">
                <div className="relative">
                  <div
                    ref={containerRef}
                    className="relative w-full h-[50vh] max-h-[500px] overflow-hidden rounded-none shadow-2xl shadow-slate-200/50 bg-slate-50"
                  >
                    <div
                      ref={scrollContainerRef}
                      className="absolute inset-0 flex flex-nowrap overflow-x-hidden no-scrollbar"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {aboutImages.map((img, index) => {
                        const visibility = getImageVisibility(index);
                        const isActive = index === activeIndex;
                        return (
                            <div
                              key={`m-${index}`}
                              className="flex-none relative h-full transition-all duration-300 ease-out"
                              style={{ width: 'calc(100% - 8px)', marginRight: index === aboutImages.length - 1 ? '0' : '16px' }}
                            >
                            <div
                              className="relative w-full h-full overflow-hidden rounded-none transition-all duration-300 ease-out"
                              style={{
                                transform: isActive ? 'scale(1)' : `scale(${0.9 + visibility * 0.1})`,
                                opacity: isActive ? 1 : 0.7 + visibility * 0.3,
                                filter: isActive ? 'brightness(1)' : `brightness(${0.8 + visibility * 0.2})`,
                                boxShadow: isActive
                                  ? '0 20px 40px rgba(0,0,0,0.15)'
                                  : `0 10px 20px rgba(0,0,0,${0.05 + visibility * 0.1})`,
                              }}
                            >
                              <img src={img.url} alt={`Kyaw Kyar Showroom ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                              {!isActive && (
                                <div
                                  className="absolute inset-0 bg-black/30 transition-opacity duration-300"
                                  style={{ opacity: 1 - visibility }}
                                />
                              )}
                            </div>
                            <button onClick={() => scrollToImage(index)} className="absolute inset-0 z-10" aria-label={`View image ${index + 1}`} />
                          </div>
                        );
                      })}
                    </div>

                    {activeIndex > 0 && (
                      <button
                        onClick={() => scrollToImage(activeIndex - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-none shadow-lg hover:bg-white transition-all"
                        aria-label="Previous image"
                      >
                        <div className="w-5 h-5 flex items-center justify-center text-slate-700">←</div>
                      </button>
                    )}
                    {activeIndex < aboutImages.length - 1 && (
                      <button
                        onClick={() => scrollToImage(activeIndex + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-none shadow-lg hover:bg-white transition-all"
                        aria-label="Next image"
                      >
                        <div className="w-5 h-5 flex items-center justify-center text-slate-700">→</div>
                      </button>
                    )}
                  </div>

                  <div className="mt-3 px-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {aboutImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => scrollToImage(index)}
                            className={`${index === activeIndex ? 'w-6 h-2 bg-indigo-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'} rounded-none transition-all duration-300`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500">Use arrows or dots to navigate</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 px-2">
                    <div className="relative h-1 bg-slate-200 rounded-none overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-indigo-600 rounded-none transition-all duration-300"
                        style={{ width: `${((activeIndex + 1) / Math.max(aboutImages.length, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* DESKTOP VIEW */}
              <div className="hidden xl:grid grid-cols-2 gap-8">
                {aboutImages.map((img, i) => (
                  <div key={`d-${i}`} className={`w-full transition-all duration-500 group/img ${i % 2 !== 0 ? 'mt-8' : ''}`}>
                    <div className="relative overflow-hidden rounded-none shadow-2xl shadow-slate-200/50">
                      <img
                        src={img.url}
                        alt={`Kyaw Kyar Showroom ${i}`}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110 ${i === 0 || i === 3 ? 'aspect-[4/5]' : 'aspect-square'}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Side */}
            <div className="py-4 order-1 md:order-2">
              <h3 className={`text-sm font-black text-indigo-600 uppercase tracking-[0.2em] mb-3 ${isMyanmar ? 'font-myanmar' : ''}`}>
                {t('about_teaser.badge', 'About KyawKyar')}
              </h3>
              <h2 className={`text-2xl md:text-4xl font-black text-slate-900 mb-6 leading-tight ${isMyanmar ? 'font-myanmar leading-[1.4]' : ''}`}>
                {t('about_teaser.title', 'Your Trusted Multi-Brand Car Showroom in Myanmar')}
              </h2>
              <p className={`text-slate-600 mb-8 text-lg leading-relaxed ${isMyanmar ? 'font-myanmar leading-[1.8]' : ''}`}>
                {t('about_teaser.description', "With over 15 years of experience, Kyaw Kyar has established itself as Myanmar's leading destination for quality vehicles. We hand-select every car, perform comprehensive multi-point inspections, and provide flexible financing options to make your dream car ownership a reality. From daily-use vehicles to premium luxury cars, we offer transparent pricing, verified clean history, and dedicated after-sales support—all backed by our commitment to excellence and customer satisfaction.")}
              </p>
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Contact Us</h4>
                <div className="flex items-center gap-4">
                  <a
                    href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                    className="w-12 h-12 bg-red-600 rounded-none flex items-center justify-center hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-90"
                    aria-label="Call Us"
                  >
                    <Phone className="h-6 w-6 text-white" />
                  </a>

                  <a
                    href={`viber://chat?number=%2B${viberNumber}`}
                    className="w-12 h-12 bg-white rounded-none flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg shadow-slate-200 overflow-hidden active:scale-90"
                    aria-label="Viber"
                  >
                    <img src={ViberIcon} alt="Viber" className="h-full w-full object-cover" />
                  </a>

                  <a
                    href={apiFacebook || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 bg-blue-600 rounded-none flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-90"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-6 w-6 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaser;
