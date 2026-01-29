import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Menu, X, Globe, User, ChevronDown, Facebook } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo-with-text.png';
import ViberIcon from '../assets/viber-icon.avif';
import { useAuth } from '../contexts/AuthContext';
import { useGetApiHome } from '../services/api';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation('common'); // Use 'common' namespace
  const currentLang = i18n.language;
  const { data: homeData } = useGetApiHome();
  const apiPhone = homeData?.phoneNo ?? undefined;
  const apiViber = homeData?.viberNo ?? undefined;
  const apiFacebook = homeData?.facebookLink ?? undefined;
  const phoneNumber = (apiPhone ?? '').toString();
  const viberNumber = (apiViber ??  '').toString().replace(/\s/g, '').replace(/^\+/, '');


  const isActive = (path: string) => {
    const current = location.pathname;

    // Home must match exactly
    if (path === '/') return current === '/';

    // Treat car detail pages as part of the Buy Cars section
    if (path === '/buyCars') return current === '/buyCars' || current.startsWith('/cars');

    return current === path;
  };

  const navLinkClass = (path: string) => {
    const active = isActive(path);
    return `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active
      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
      }`;
  };

  const handleLanguageChange = () => {
    const newLang = currentLang === 'en' ? 'mm' : 'en';
    i18n.changeLanguage(newLang);
  };

  // Use keys from common.json for navigation
  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/buyCars', label: t('nav.buyCars') },
    { path: '/sellCars', label: t('nav.sellCars') },
    { path: '/payments', label: t('nav.payments') },
    { path: '/about', label: t('nav.about') },
  ];

  const accountRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) {
        setIsContactOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header
      className={`w-full ${isHome ? 'absolute inset-x-0 top-0 z-40' : 'relative z-10'} transition`}
      aria-hidden={false}
    >
      <div
        className={`${isHome ? 'bg-transparent' : 'bg-white'} ${isHome ? '' : 'shadow-sm'
          } backdrop-blur-sm/0 transition-colors`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img src={logo} alt="ကျော်ကြား car showroom" className="h-16 md:h-20 w-auto object-contain" />
            </Link>

            {/* Desktop Navigation - Centered Pill */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-full border border-gray-200/50 backdrop-blur-sm">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass(item.path)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={handleLanguageChange}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 group"
                aria-label="Toggle Language"
              >
                <Globe className="h-4 w-4 text-gray-500 group-hover:text-indigo-600" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">
                  {t(`nav.language`)}
                </span>
              </button>

              {/* Contact Button (desktop) */}
              <div ref={contactRef} className="relative">
                <button
                  onClick={() => setIsContactOpen((s) => !s)}
                  aria-expanded={isContactOpen}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="hidden sm:inline">{t('buttons.contact', 'Contact')}</span>
                </button>

                {isContactOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-50">
                    <a
                      href={`tel:${phoneNumber.replace(/\s/g, '')}` }
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                      onClick={() => setIsContactOpen(false)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-red-600 rounded-full">
                        <Phone className="h-4 w-4 text-white" />
                      </div>
                      <span>{t('buttons.call_us', 'Call Us')}</span>
                    </a>
                    <a
                      href={`viber://chat?number=%2B${viberNumber}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                      onClick={() => setIsContactOpen(false)}
                    >
                      <img src={ViberIcon} alt="Viber" className="h-8 w-8 rounded-md" />
                      <span>{t('buttons.viber', 'Viber')}</span>
                    </a>
                    
                    <a
                      href={apiFacebook || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                      onClick={() => setIsContactOpen(false)}
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                        <Facebook className="h-5 w-5 text-white" />
                      </div>
                      <span>{t('buttons.facebook', 'Facebook')}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Account / Avatar Button */}
              <div ref={accountRef} className="relative">
                {user ? (
                  <button
                    onClick={() => navigate('/admin')}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsAccountOpen((s) => !s)}
                      aria-expanded={isAccountOpen}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700">
                        <User className="h-4 w-4" />
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </button>

                    {isAccountOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-md shadow-lg py-1 z-50">
                        <Link
                          to="/admin/login"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                          onClick={() => setIsAccountOpen(false)}
                        >
                          <User className="h-4 w-4 text-slate-500" />
                          <span>{t('buttons.login', 'Login')}</span>
                        </Link>
                        {/* Register removed: admin-only login; no public signup */}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 py-6 space-y-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    handleLanguageChange();
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <Globe className="h-5 w-5 text-gray-500" />
                  <span className="font-medium text-slate-700">{t('nav.language')}</span>
                </button>

                <div>
                  <button
                    onClick={() => setIsContactOpen((s) => !s)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm w-full"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">{t('buttons.contact', 'Contact')}</span>
                  </button>
                </div>

                {user ? (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors w-full"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Admin</span>
                  </button>
                ) : (
                  <Link
                    to="/admin/login"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">{t('buttons.login', 'Login')}</span>
                  </Link>
                )}

                <div />
              </div>

              {isContactOpen && (
                <div className="mt-3 px-2 space-y-2">
                  <a
                    href={`tel:${phoneNumber.replace(/\s/g, '')}` }
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsContactOpen(false)}
                  >
                     <div className="flex items-center justify-center w-6 h-6 mr-2 bg-red-600 rounded-full">
                        <Phone className="h-3.5 w-3.5 text-white" />
                      </div>
                    <span className="font-medium">{t('buttons.call_us')}</span>
                  </a>
                  <a
                    href={`viber://chat?number=%2B${viberNumber}`}
                    className="block w-full text-center px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsContactOpen(false)}
                  >
                    <img src={ViberIcon} alt="Viber" className="inline h-5 w-5 mr-2 rounded-full" />
                    <span className="font-medium">{t('buttons.viber', 'Viber')}</span>
                  </a>
                  
                  <a
                    href={apiFacebook || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsContactOpen(false)}
                  >
                     <div className="flex items-center justify-center w-6 h-6 mr-2 bg-blue-600 rounded-full">
                        <Facebook className="h-3.5 w-3.5 text-white" />
                      </div>
                    <span className="font-medium">{t('buttons.facebook', 'Facebook')}</span>
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
