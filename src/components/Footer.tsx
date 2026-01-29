import React from 'react';
import {  Facebook, Phone } from 'lucide-react';
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
  const phoneNumber = (apiPhone ?? '').toString();
  const viberNumber = (apiViber ??  '').toString().replace(/\s/g, '').replace(/^\+/, '');

  return (
    <footer className="bg-slate-900 text-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
              <img src={Logo} className='h-10 w-10'/>
              <div>
                <h3 className="text-2xl font-bold text-red-500">{t('name')}</h3>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <a href={apiFacebook || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={`viber://chat?number=%2B${viberNumber}`} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors overflow-hidden">
                 <img src={ViberIcon} alt="Viber" className="h-full w-full object-cover" />
              </a>
              <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('quick_links')}</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-white transition-colors">{t('quick_links_home', 'Home')}</a></li>
              <li><a href="#inventory" className="text-gray-300 hover:text-white transition-colors">{t('quick_links_inventory', 'Car Inventory')}</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-white transition-colors">{t('quick_links_about', 'About Us')}</a></li>
              <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">{t('quick_links_testimonials', 'Customer Reviews')}</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">{t('quick_links_contact', 'Contact')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('services.title')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li>{t('services.buy')}</li>
              <li>{t('services.sell')}</li>
              <li>{t('services.financing')}</li>
              <li>{t('services.trade_in')}</li>
              <li>{t('services.insurance')}</li>
              <li>{t('services.after_sale')}</li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
