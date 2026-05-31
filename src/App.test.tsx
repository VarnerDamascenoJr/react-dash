import { render, screen } from '@testing-library/react';
import App from './App';
import { DarkModeContextProvider } from './context/darkModeContext';

test('renders the dashboard widgets on the home page', () => {
  render(
    <DarkModeContextProvider>
      <App />
    </DarkModeContextProvider>
  );

  expect(screen.getByText(/total revenue/i)).toBeInTheDocument();
});
