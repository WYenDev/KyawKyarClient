import React from 'react';
import { 
  Award, Shield, Users, Clock, Phone, 
  MessageCircle, MapPin, ArrowUpRight, HelpCircle 
} from 'lucide-react';

const AboutContact: React.FC = () => {
  const viberNumber = "959123456789"; // General Inquiry Viber

  const locations = [
    { 
      city: "Mandalay (Main Showroom)", 
      address: "၁၂၃၊ စက်မှုဇုန်လမ်း၊ ပြည်ကြီးတံခွန်မြို့နယ်၊ မန္တလေးမြို့။", 
      phone: "09 111 222 333",
      mapUrl: "https://maps.google.com/?q=Mandalay" 
    },
    { 
      city: "Yangon Branch", 
      address: "၄၅၆၊ ကမ္ဘာအေးဘုရားလမ်း၊ ဗဟန်းမြို့နယ်၊ ရန်ကုန်မြို့။", 
      phone: "09 444 555 666",
      mapUrl: "https://maps.google.com/?q=Yangon" 
    },
    { 
      city: "Naypyidaw Branch", 
      address: "၇၈၉၊ သီရိမန္တလာလမ်း၊ ဇမ္ဗူသီရိမြို့နယ်၊ နေပြည်တော်။", 
      phone: "09 777 888 999",
      mapUrl: "https://maps.google.com/?q=Naypyidaw" 
    },
  ];

  return (
    <div className="bg-white">
      {/* --- SECTION 1: ABOUT US --- */}
      <section id="about" className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 opacity-60" />
              <img
                src="https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="KyawKyar Showroom"
                className="rounded-[3rem] shadow-2xl border-8 border-white object-cover h-[500px] w-full"
              />
              <div className="absolute -bottom-8 -right-8 bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-black text-indigo-400 mb-1">15+</div>
                  <div className="text-xs uppercase tracking-widest font-bold opacity-70">Years of Excellence</div>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="space-y-8">
              <div>
                <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-3 inline-block">
                  Our Legacy
                </span>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                  Myanmar's Premier <br />
                  <span className="text-indigo-600">Automotive Destination</span>
                </h2>
              </div>

              <p className="text-lg text-slate-500 leading-relaxed">
                For over 15 years, KyawKyar has been the leading destination for quality vehicles in Myanmar.
                We've built our reputation on transparency, helping thousands of families find their perfect drive.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: <Award className="text-indigo-600" />, title: "Quality Assured", desc: "150-point check" },
                  { icon: <Shield className="text-emerald-600" />, title: "Warranty", desc: "6-month guarantee" },
                  { icon: <Users className="text-blue-600" />, title: "Expert Team", desc: "Professional staff" },
                  { icon: <Clock className="text-amber-600" />, title: "Fast Process", desc: "Quick ownership" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: CONTACT & BRANCHES --- */}
      <section id="contact" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[4rem] p-12 lg:p-20 shadow-xl shadow-indigo-100/50 relative overflow-hidden">
            
            {/* Background Decorative Icon */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <MessageCircle size={400} className="text-indigo-600" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-start">
              
              {/* LEFT SIDE: Balanced Content */}
              <div className="space-y-12 lg:sticky lg:top-10">
                <div className="text-center lg:text-left">
                  <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase mb-3 inline-block">
                    Get In Touch
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
                    Let's Get You <br />
                    <span className="text-indigo-600">On The Road</span>
                  </h2>
                  <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                    Skip the forms. Reach out to our sales team directly for instant pricing and availability.
                  </p>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="tel:+959123456789"
                    className="flex-1 flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
                  >
                    <Phone size={20} className="group-hover:rotate-12 transition-transform" />
                    Call Sales Team
                  </a>
                  <a
                    href={`viber://add?number=${viberNumber}`}
                    className="flex-1 flex items-center justify-center gap-3 bg-[#7360f2] text-white px-8 py-5 rounded-2xl font-bold hover:bg-[#6654e0] transition-all shadow-xl shadow-indigo-200"
                  >
                    <MessageCircle size={20} />
                    Chat on Viber
                  </a>
                </div>

                {/* Help Center / FAQ Box */}
                <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-6 border border-slate-100">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="text-indigo-600 w-5 h-5" />
                    How can we help?
                  </h4>
                  <div className="grid gap-5">
                    {[
                      { q: "Looking for a specific model?", a: "Ask our team about upcoming stock and pre-orders." },
                      { q: "Need a trade-in value?", a: "Bring your car to any branch for a free valuation." },
                      { q: "Finance questions?", a: "We provide instant calculations for bank and showroom plans." }
                    ].map((item, i) => (
                      <div key={i}>
                        <p className="text-sm font-bold text-slate-800">{item.q}</p>
                        <p className="text-xs text-slate-500 mt-1 italic">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Stats Row */}
                <div className="flex items-center justify-between lg:justify-start lg:gap-12 px-4 grayscale opacity-40">
                  <div className="text-center lg:text-left">
                    <p className="text-2xl font-black text-slate-900">98%</p>
                    <p className="text-[10px] font-bold uppercase tracking-tighter">Happy Clients</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-2xl font-black text-slate-900">24h</p>
                    <p className="text-[10px] font-bold uppercase tracking-tighter">Fast Approval</p>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-2xl font-black text-slate-900">3</p>
                    <p className="text-[10px] font-bold uppercase tracking-tighter">Major Cities</p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Branch Cards */}
              <div className="grid gap-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">
                  Showroom တည်နေရာများ (Locations)
                </p>

                {locations.map((loc, i) => (
                  <div
                    key={i}
                    className="group bg-slate-50 rounded-[2.5rem] p-6 border border-slate-100 transition-all hover:border-indigo-200 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100/40"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-indigo-50 transition-colors">
                          <MapPin className="text-indigo-600 w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-lg">{loc.city}</h4>
                          <p className="text-sm text-slate-500 leading-relaxed max-w-[220px]">
                            {loc.address}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => window.open(loc.mapUrl, '_blank')}
                        className="p-3 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                        title="View on Map"
                      >
                        <ArrowUpRight size={20} />
                      </button>
                    </div>

                    <a
                      href={`tel:${loc.phone.replace(/\s/g, '')}`}
                      className="flex items-center justify-center gap-3 w-full py-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold text-base hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                    >
                      <Phone size={18} className="text-indigo-600 group-hover:text-white" />
                      {loc.phone}
                    </a>

                    <div className="mt-3 text-center">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to Call Branch
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutContact;
