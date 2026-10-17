import ptHome from './locales/pt-BR/home.json';
import ptShell from './locales/pt-BR/shell.json';
import ptLogin from './locales/pt-BR/login.json';
import enHome from './locales/en-US/home.json';
import enShell from './locales/en-US/shell.json';
import enLogin from './locales/en-US/login.json';

export const resources = {
  'pt-BR': { home: ptHome, shell: ptShell, login: ptLogin },
  'en-US': { home: enHome, shell: enShell, login: enLogin },
};

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'home';
    resources: typeof resources['pt-BR'];
  }
}
