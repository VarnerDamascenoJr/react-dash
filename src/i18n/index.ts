import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { loadLanguage, resolveLanguage, saveLanguage, supportedLanguages } from './preferences';
import { resources } from './resources';

const i18n = createInstance();

i18n.on('languageChanged', (language) => {
  const locale = resolveLanguage(language);
  document.documentElement.lang = locale;
  saveLanguage(locale);
});

// All catalogs ship with the app: initialization needs no network or Suspense.
void i18n.use(initReactI18next).init({
  resources,
  lng: loadLanguage(),
  fallbackLng: 'pt-BR',
  supportedLngs: [...supportedLanguages],
  load: 'currentOnly',
  defaultNS: 'home',
  ns: ['home', 'shell', 'login'],
  initAsync: false,
  interpolation: { escapeValue: false }, // React escapes rendered text.
});

export default i18n;
