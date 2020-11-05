import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Fetch from 'i18next-fetch-backend';

import { API_URL, TRANSLATIONS_API_KEY } from './utils/constants';
import { getEnvironmentName } from './utils/utils';

const backendOptions = {
  // path where resources get loaded from, or a function
  // returning a path:
  // function(lngs, namespaces) { return customPath; }
  // the returned path will interpolate lng, ns if provided like giving a static path
  loadPath: API_URL + '/translations/{{ns}}/{{lng}}',

  // path to post missing resources
  addPath: API_URL + '/translation/{{ns}}/{{lng}}',

  // your backend server supports multiloading
  // /locales/resources.json?lng=de+en&ns=ns1+ns2
  // Adapter is needed to enable MultiLoading https://github.com/i18next/i18next-multiload-backend-adapter
  // Returned JSON structure in this case is
  // {
  //  lang : {
  //   namespaceA: {},
  //   namespaceB: {},
  //   ...etc
  //  }
  // }
  allowMultiLoading: false, // set loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}' to adapt to multiLoading

  // define how to stringify the data when adding missing resources
  stringify: payload => {
    return JSON.stringify({
      missing: payload,
    });
  },
};

if (TRANSLATIONS_API_KEY) {
  backendOptions.requestOptions = {
    headers: {
      Authorization: `ApiKey ${TRANSLATIONS_API_KEY}`,
    },
  };
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(Fetch)
  .init({
    backend: backendOptions,
    debug: getEnvironmentName(document.location.hostname) === 'development',
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
    nsSeparator: '::',
    preload: ['en'],
    //useLocalStorage: true | false,
    //localStorageExpirationTime: 86400000, // in ms, default 1 week
    saveMissing: TRANSLATIONS_API_KEY ? true : false, // send not translated keys to endpoint
    saveMissingTo: 'all',
  });

export default i18n;
