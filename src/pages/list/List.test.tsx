import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import i18n from '../../i18n';
import List from './List';

vi.mock('../../components/datatable/Datatable', () => ({ default: () => null }));

test('translates the list introduction when the selected language changes', async () => {
  render(<List />);

  expect(screen.getByText('Gestão de usuários')).toBeVisible();
  expect(screen.getByRole('heading', {
    name: 'Gerencie usuários e acompanhe a situação das contas.',
  })).toBeVisible();
  expect(screen.getByText(
    'Confira as atividades, verifique os status e mantenha a lista da sua equipe organizada em uma única tabela.'
  )).toBeVisible();

  await act(async () => { await i18n.changeLanguage('en-US'); });

  expect(screen.getByText('Operations roster')).toBeVisible();
  expect(screen.getByRole('heading', {
    name: 'Manage users and monitor account health.',
  })).toBeVisible();
  expect(screen.getByText(
    'Review activity, inspect statuses and keep your team list organized from one table.'
  )).toBeVisible();
  expect(screen.queryByText('Gestão de usuários')).not.toBeInTheDocument();
});
