import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Facebook, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetApiHome } from '../services/api';
import ViberIcon from '../assets/viber-icon.avif';
import Logo from '../assets/logo-removebg.png';
import { getCompanyYears } from '../utils/company';

const Footer: React.FC = () => {
  const { t } = useTranslation('footer');
  const { lang } = useParams<{ lang?: string }>();
  const currentLang = lang || 'my';
  const years = getCompanyYears();

  const getPath = (path: string) => `/${currentLang}${path === '/' ? '' : path}`;

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
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Company Info */}
          <div className="lg:w-full lg:max-w-md lg:flex-none">
            <div className="flex items-center gap-3 mb-4">
              <img src={Logo} alt="Kyaw Kyar" className="h-10 w-10 object-contain" />
              <h3 className="text-2xl font-bold text-red-500">{t('name')}</h3>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              {t('description', { years })}
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
                  <img src={ViberIcon} alt="Viber" className="h-full w-full object-cover" />
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

          <div className="flex flex-col gap-8 lg:flex-1 lg:flex-row lg:justify-between lg:pl-16">
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold">{t('quick_links')}</h4>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>
                  <Link to={getPath('/')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('quick_links_home', 'Home')}
                  </Link>
                </li>
                <li>
                  <Link to={getPath('/buyCars')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('quick_links_inventory', 'Car Inventory')}
                  </Link>
                </li>
                <li>
                  <Link to={getPath('/#showrooms')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('quick_links_showroom', 'Showrooms')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Why Buy From Us */}
            <div>
              <h4 className="text-lg font-semibold">{t('why_buy.title')}</h4>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>
                  <Link to={getPath('/why-kyawkyar/rigorous-quality-inspection')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('why_buy.inspection')}
                  </Link>
                </li>
                <li>
                  <Link to={getPath('/payments')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('why_buy.financing')}
                  </Link>
                </li>
                <li>
                  <Link to={getPath('/why-kyawkyar/resell-market-price')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('why_buy.market_price')}
                  </Link>
                </li>
                <li>
                  <Link to={getPath('/why-kyawkyar/clean-history')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('why_buy.clean_history')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold">{t('services.title')}</h4>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>
                  <Link to={getPath('/buyCars')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('services.buy')}
                  </Link>
                </li>
                <li>
                  <Link to={getPath('/sellCars')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('services.sell')}
                  </Link>
                </li>
                <li>
                  <Link to={getPath('/payments')} className="block leading-relaxed hover:text-white transition-colors">
                    {t('services.financing')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
