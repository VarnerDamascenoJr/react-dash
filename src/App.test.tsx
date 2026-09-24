import { render, screen } from '@testing-library/react';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';
import { AuthContextProvider } from './context/authContext';
import { demoUser } from './config/auth';

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
});
