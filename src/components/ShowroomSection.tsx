import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetApiShowrooms, Showroom } from '../services/api';
import { MapPin, Phone, ExternalLink, X, PhoneCall } from 'lucide-react';

const ShowroomSection: React.FC = () => {
  const { t, i18n } = useTranslation('home');
  const isMyanmar = i18n?.language?.startsWith('mm');

  const [selectedShowroom, setSelectedShowroom] = useState<Showroom | null>(null);

  // Fetch all showrooms
  const { data, isLoading } = useGetApiShowrooms({ limit: 100 });
  const showrooms = data?.items ?? [];

  const handleCallClick = (showroom: Showroom) => {
    const phones = showroom.phones ?? [];
    if (phones.length === 0) return;
    
    if (phones.length === 1) {
      window.location.href = `tel:${phones[0].phone}`;
    } else {
      setSelectedShowroom(showroom);
    }
  };

  if (isLoading) return null; // Or a loading skeleton
  if (showrooms.length === 0) return null;

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background elements matched to other sections */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-50/50 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-2xl lg:text-4xl font-black text-slate-900 tracking-tight ${isMyanmar ? 'font-myanmar leading-[1.6]' : 'leading-[1.4]'}`}>
            {isMyanmar ? (
              <>
                <span className="inline-block pt-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {t('showrooms.highlightedText')}
                </span>{" "}
                {t('showrooms.title')}
              </>
            ) : (
              <>
                {t('showrooms.title')}{" "}
                <span className="inline-block py-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {t('showrooms.highlightedText')}
                </span>
              </>
            )}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {showrooms.map((showroom) => (
            <div key={showroom.id} className="bg-white rounded-none p-6 border border-slate-100 transition-all h-full flex flex-col group/card">
              <h3 className={`text-xl font-bold text-slate-900 mb-4 ${isMyanmar ? 'font-myanmar' : ''}`}>
                {showroom.name || showroom.city}
              </h3>

              <div className="space-y-4 flex-grow">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className={`text-slate-600 leading-relaxed line-clamp-3 md:h-[4.8rem] ${isMyanmar ? 'font-myanmar leading-[1.8] md:h-[5.4rem]' : ''}`}>
                      {isMyanmar ? (showroom.addressMm || showroom.addressEn) : showroom.addressEn}
                    </p>
                    {showroom.city && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 bg-slate-200 text-slate-700 text-xs font-semibold rounded-none uppercase tracking-wider">
                        {showroom.city}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCallClick(showroom)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-none bg-slate-900 text-white font-black hover:bg-indigo-600 active:scale-95 transition-all text-sm ${isMyanmar ? 'font-myanmar pt-3.5' : ''}`}
                  >
                    <PhoneCall size={16} />
                    {t('showrooms.callNow', 'ဖုန်းခေါ်ဆိုရန်')}
                  </button>

                  {showroom.googleMapUrl ? (
                    <a
                      href={showroom.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-2 py-3 rounded-none bg-slate-100 border border-slate-200 text-slate-700 font-black hover:bg-slate-200 active:scale-95 transition-all text-sm ${isMyanmar ? 'font-myanmar pt-3.5' : ''}`}
                    >
                      <ExternalLink size={16} />
                      {t('showrooms.viewMap', 'မြေပုံကြည့်ရန်')}
                    </a>
                  ) : <div />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phone Selection Modal */}
      {selectedShowroom && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-none w-full max-w-sm overflow-hidden relative border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className={`font-black text-slate-900 uppercase tracking-wider ${isMyanmar ? 'font-myanmar pt-1' : ''}`}>
                {t('showrooms.choosePhone', 'ဖုန်းနံပါတ်ရွေးချယ်ပါ')}
              </h3>
              <button
                onClick={() => setSelectedShowroom(null)}
                className="p-2 hover:bg-slate-200 rounded-none transition-colors border border-transparent hover:border-slate-300"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {selectedShowroom.phones?.map((p) => (
                <a
                  key={p.id}
                  href={`tel:${p.phone}`}
                  onClick={() => setSelectedShowroom(null)}
                  className="flex items-center justify-between p-4 rounded-none bg-white border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                  <span className="text-slate-700 font-bold text-lg">{p.phone}</span>
                  <div className="w-10 h-10 rounded-none bg-slate-900 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <Phone size={18} className="text-white" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShowroomSection;
