import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import ruTranslation from './locales/ru.json';
import uzTranslation from './locales/uz.json';

const resources = {
  en: { translation: enTranslation },
  ru: { translation: ruTranslation },
  uz: { translation: uzTranslation }
};

i18n
  .use(LanguageDetector) // Tries to detect language from localStorage or browser
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values to prevent XSS
    }
  });

export default i18n;
