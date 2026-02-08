import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact: React.FC = () => {
  const { t, i18n } = useTranslation('contact');
  const isMyanmar = i18n?.language?.startsWith('mm');

  return (
    <section id="contact" className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${isMyanmar ? 'font-myanmar max-sm:text-[2rem]' : ''}`}>{t('title')}</h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid xl:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="xl:col-span-1">
            <h3 className="text-2xl font-bold mb-6">{t('info.title')}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t('info.address.title')}</h4>
                  <p className="text-gray-300">{t('info.address.line1')}</p>
                  <p className="text-gray-300">{t('info.address.line2')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t('info.phone.title')}</h4>
                  <p className="text-gray-300">{t('info.phone.mobile')}</p>
                  <p className="text-gray-300">{t('info.phone.landline')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t('info.email.title')}</h4>
                  <p className="text-gray-300">{t('info.email.general')}</p>
                  <p className="text-gray-300">{t('info.email.sales')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{t('info.hours.title')}</h4>
                  <p className="text-gray-300">{t('info.hours.weekdays')}</p>
                  <p className="text-gray-300">{t('info.hours.weekends')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-none p-8 text-gray-900">
              <h3 className="text-2xl font-bold mb-6">{t('form.title')}</h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.full_name')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('form.full_name_placeholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('form.phone')}
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('form.phone_placeholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('form.email_placeholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.interest')}
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">{t('form.interest_placeholder')}</option>
                    <option value="buying">{t('form.interest_buying')}</option>
                    <option value="selling">{t('form.interest_selling')}</option>
                    <option value="financing">{t('form.interest_financing')}</option>
                    <option value="other">{t('form.interest_other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('form.message')}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('form.message_placeholder')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{t('form.send_message')}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Branch Locations */}
        <div className="mt-16 pt-12 border-t border-gray-700">
          <h3 className="text-2xl font-bold text-center mb-8">{t('locations.title')}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <h4 className="font-semibold text-lg mb-2">{t('locations.yangon.title')}</h4>
              <p className="text-gray-300 text-sm">{t('locations.yangon.address')}</p>
              <p className="text-blue-400 text-sm mt-2">{t('locations.yangon.note')}</p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <h4 className="font-semibold text-lg mb-2">{t('locations.mandalay.title')}</h4>
              <p className="text-gray-300 text-sm">{t('locations.mandalay.address')}</p>
              <p className="text-blue-400 text-sm mt-2">{t('locations.mandalay.note')}</p>
            </div>
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <h4 className="font-semibold text-lg mb-2">{t('locations.naypyidaw.title')}</h4>
              <p className="text-gray-300 text-sm">{t('locations.naypyidaw.address')}</p>
              <p className="text-blue-400 text-sm mt-2">{t('locations.naypyidaw.note')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;