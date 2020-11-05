import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import resources from '../../public/assets/languages';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: true, // TODO: production
    resources,
    lng: 'en', // override language detection
    fallbackLng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: true, // use if translations are fetched from backend
    },
    ns: ['common', 'gavle', 'rauma'],
    defaultNS: 'common',
    nsMode: 'fallback',
    preload: ['en'],
  });

export default i18n;
