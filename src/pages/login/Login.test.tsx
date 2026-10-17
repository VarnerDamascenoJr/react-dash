import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import type { AuthContextValue } from '../../auth/auth.types';
import { demoLoginEmail, demoLoginPassword } from '../../config/auth';
import { AuthContext, DemoAuthenticationError } from '../../context/authContext';
import Login from './Login';

function CurrentLocation() {
  const { pathname, search, hash } = useLocation();
  return <output aria-label="Current location">{pathname}{search}{hash}</output>;
}

function renderLogin(login: AuthContextValue['login'], state: unknown = null) {
  return render(
    <AuthContext.Provider
      value={{ user: null, isAuthenticated: false, login, logout: () => undefined }}
    >
      <MemoryRouter initialEntries={[{ pathname: '/login', state }]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<CurrentLocation />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

test('validates required credentials before calling authentication', () => {
  const login = vi.fn();
  renderLogin(login);

  fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: '' } });
  fireEvent.submit(screen.getByRole('button', { name: /entrar no painel/i }).closest('form')!);

  expect(screen.getByLabelText(/e-mail/i)).toBeInvalid();
  expect(login).not.toHaveBeenCalled();

  fireEvent.change(screen.getByLabelText(/e-mail/i), { target: { value: demoLoginEmail } });
  fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: '' } });
  fireEvent.submit(screen.getByRole('button', { name: /entrar no painel/i }).closest('form')!);

  expect(screen.getByLabelText(/senha/i)).toBeInvalid();
  expect(login).not.toHaveBeenCalled();
});

test('locks credentials and ignores duplicate submissions while authentication is pending', async () => {
  let finishLogin: () => void = () => undefined;
  const pendingLogin = new Promise<void>((resolve) => { finishLogin = resolve; });
  const login = vi.fn(() => pendingLogin);
  renderLogin(login);

  const form = screen.getByRole('button', { name: /entrar no painel/i }).closest('form')!;
  act(() => {
    fireEvent.submit(form);
    fireEvent.submit(form);
  });

  expect(login).toHaveBeenCalledTimes(1);
  expect(login).toHaveBeenCalledWith({ email: demoLoginEmail, password: demoLoginPassword });
  expect(screen.getByLabelText(/e-mail/i)).toBeDisabled();
  expect(screen.getByLabelText(/senha/i)).toBeDisabled();
  expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();

  await act(async () => { finishLogin(); });
  expect(screen.getByLabelText('Current location')).toHaveTextContent('/');
});

test('translates authentication feedback and clears it when credentials change', async () => {
  renderLogin(vi.fn().mockRejectedValue(new DemoAuthenticationError()));
  fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Use a conta de demonstração');
  expect(screen.getByLabelText(/senha/i)).toHaveAttribute('aria-describedby', 'login-error');

  fireEvent.change(screen.getByRole('combobox', { name: 'Idioma' }), { target: { value: 'en-US' } });
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Use the demo account'));
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'another-password' } });

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).not.toHaveAttribute('aria-invalid', 'true');
});

test('allows retrying after an unexpected authentication failure', async () => {
  const login = vi.fn()
    .mockRejectedValueOnce(new Error('Unavailable'))
    .mockResolvedValueOnce(undefined);
  renderLogin(login);
  fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível entrar. Tente novamente.');
  expect(screen.getByLabelText(/senha/i)).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }));

  expect(await screen.findByLabelText('Current location')).toHaveTextContent('/');
  expect(login).toHaveBeenCalledTimes(2);
});

test('restores the complete destination after signing in', async () => {
  renderLogin(vi.fn().mockResolvedValue(undefined), {
    from: { pathname: '/', search: '?view=events', hash: '#overview' },
  });
  fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }));

  expect(await screen.findByLabelText('Current location')).toHaveTextContent('/?view=events#overview');
});
