import i18n from './i18n';
import '@testing-library/jest-dom';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

beforeEach(async () => {
  await i18n.changeLanguage('pt-BR');
});
