import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './translations/en.json';
import rwTranslations from './translations/rw.json';

// Debug logs
console.log('English translations:', enTranslations);
console.log('Kinyarwanda translations:', rwTranslations);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      rw: {
        translation: rwTranslations
      }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
    },
    returnObjects: true,
    returnNull: false,
    defaultNS: 'translation',
    ns: ['translation']
  });

// Debug log after initialization
console.log('i18n instance:', i18n);
console.log('Available languages:', i18n.languages);
console.log('Current language:', i18n.language);

export default i18n; 