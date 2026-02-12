import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetApiHome } from '../services/api';
import ViberIcon from '../assets/viber-icon.avif';
import Logo from '../assets/logo-removebg.png';

const Footer: React.FC = () => {
  const { t } = useTranslation('footer');

  const { data: homeData } = useGetApiHome();
  const apiPhone = homeData?.phoneNo ?? undefined;
  const apiViber = homeData?.viberNo ?? undefined;
  const apiFacebook = homeData?.facebookLink ?? undefined;
  const phoneNumber = (apiPhone ?? '').toString().trim();
  const viberNumber = (apiViber ?? '').toString().replace(/\s/g, '').replace(/^\+/, '').trim();
  const hasPhone = phoneNumber.length > 0;
  const hasViber = viberNumber.length > 0;
  const hasFacebook = Boolean(apiFacebook?.trim?.());

  return (
    <footer className="bg-slate-900 text-slate-50">
      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={Logo} alt="" className="h-10 w-10 object-contain" />
              <h3 className="text-2xl font-bold text-red-500">{t('name')}</h3>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              {t('description')}
            </p>
            <div className="flex gap-3">
              {hasFacebook && (
                <a
                  href={apiFacebook!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {hasViber && (
                <a
                  href={`viber://chat?number=%2B${viberNumber}`}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors overflow-hidden"
                  aria-label="Viber"
                >
                  <img src={ViberIcon} alt="" className="h-full w-full object-cover" />
                </a>
              )}
              {hasPhone && (
                <a
                  href={`tel:${phoneNumber.replace(/\s/g, '')}`}
                  className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                  aria-label={t('quick_links_contact', 'Contact')}
                >
                  <Phone className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quick_links')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                  {t('quick_links_home', 'Home')}
                </Link>
              </li>
              <li>
                <Link to="/buyCars" className="text-slate-300 hover:text-white transition-colors">
                  {t('quick_links_inventory', 'Car Inventory')}
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-slate-300 hover:text-white transition-colors">
                  {t('quick_links_testimonials', 'Customer Reviews')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  {t('quick_links_contact', 'Contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('services.title')}</h4>
            <ul className="space-y-2 text-slate-300">
              <li>{t('services.buy')}</li>
              <li>{t('services.sell')}</li>
              <li>{t('services.financing')}</li>
              <li>{t('services.trade_in')}</li>
              <li>{t('services.insurance')}</li>
              <li>{t('services.after_sale')}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
