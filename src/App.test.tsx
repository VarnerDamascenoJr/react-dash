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

  expect(screen.getByText(/sales event analytics/i)).toBeInTheDocument();
  expect(screen.getByText(/eventos coletados/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/base url/i)).toHaveValue('/api');
  expect(screen.getByLabelText(/start/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/end/i)).toBeInTheDocument();
});

test('persists analytics filters without storing the API key', async () => {
  render(
    <AuthContextProvider>
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </AuthContextProvider>
  );

  fireEvent.change(screen.getByLabelText(/base url/i), {
    target: { value: 'http://localhost:8080' },
  });
  fireEvent.change(screen.getByLabelText(/api key/i), {
    target: { value: 'support-key' },
  });

  await waitFor(() => {
    expect(localStorage.getItem(salesAnalyticsSettingsStorageKey)).toContain(
      'http://localhost:8080'
    );
  });
  expect(localStorage.getItem(salesAnalyticsSettingsStorageKey)).not.toContain(
    'support-key'
  );
});
