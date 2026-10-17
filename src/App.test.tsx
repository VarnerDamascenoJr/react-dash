import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { AuthContextProvider } from './context/authContext';
import { demoUser } from './config/auth';
import { salesAnalyticsSettingsStorageKey } from './config/salesApi';

beforeEach(() => {
  localStorage.setItem(
    'react-dash.auth.user',
    JSON.stringify(demoUser)
  );
});

afterEach(() => {
  localStorage.clear();
});

test('renders the analytics overview on the home page', () => {
  render(
    <AuthContextProvider>
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </AuthContextProvider>
  );

  expect(screen.getByText(/análise de eventos de vendas/i)).toBeInTheDocument();
  expect(screen.getByText(/eventos coletados/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/url base/i)).toHaveValue('/api');
  expect(screen.getByLabelText(/início/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/fim/i)).toBeInTheDocument();
});

test('persists analytics filters without storing the API key', async () => {
  render(
    <AuthContextProvider>
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </AuthContextProvider>
  );

  fireEvent.change(screen.getByLabelText(/url base/i), {
    target: { value: 'http://localhost:8080' },
  });
  fireEvent.change(screen.getByLabelText(/chave da api/i), {
    target: { value: 'dev-support-key' },
  });

  await waitFor(() => {
    expect(localStorage.getItem(salesAnalyticsSettingsStorageKey)).toContain(
      'http://localhost:8080'
    );
  });
  expect(localStorage.getItem(salesAnalyticsSettingsStorageKey)).not.toContain(
    'dev-support-key'
  );
});
