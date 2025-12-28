import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all namespaces for English
import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enAbout from './locales/en/about.json';
import enCars from './locales/en/cars.json';
import enContact from './locales/en/contact.json';
import enFooter from './locales/en/footer.json';
import enReviews from './locales/en/reviews.json';
import enAdmin from './locales/en/admin.json';

// Import all namespaces for Burmese
import mmCommon from './locales/mm/common.json';
import mmHome from './locales/mm/home.json';
import mmAbout from './locales/mm/about.json';
import mmCars from './locales/mm/cars.json';
import mmContact from './locales/mm/contact.json';
import mmFooter from './locales/mm/footer.json';
import mmReviews from './locales/mm/reviews.json';
import mmAdmin from './locales/mm/admin.json';


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        home: enHome,
        about: enAbout,
        cars: enCars,
        contact: enContact,
        footer: enFooter,
        reviews: enReviews,
        admin: enAdmin
      },
      mm: {
        common: mmCommon,
        home: mmHome,
        about: mmAbout,
        cars: mmCars,
        contact: mmContact,
        footer: mmFooter,
        reviews: mmReviews,
        admin: mmAdmin
      },
    },
    lng: 'mm', // default language
    fallbackLng: 'mm',
    ns: ['common', 'home', 'about', 'cars', 'contact', 'footer', 'reviews'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
