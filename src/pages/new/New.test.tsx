import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import New from './New';
import { DarkModeContextProvider } from '../../context/darkModeContext';
import { userInputs } from '../../formSource';

const renderNewPage = () => {
  render(
    <DarkModeContextProvider>
      <MemoryRouter>
        <New inputs={userInputs} title="Add New User" />
      </MemoryRouter>
    </DarkModeContextProvider>
  );
};

test('renders the email field', () => {
  renderNewPage();
  expect(screen.getByPlaceholderText('john_doe@gmail.com')).toBeInTheDocument();
});

test('renders the phone field', () => {
  renderNewPage();
  expect(screen.getByPlaceholderText('+1 234 567 89')).toBeInTheDocument();
});

test('renders the password field', () => {
  renderNewPage();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});
