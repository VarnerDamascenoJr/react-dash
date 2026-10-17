import { expect, type Page, test } from '@playwright/test';

const demoEmail = 'admin@reactdash.dev';
const authStorageKey = 'react-dash.auth.user';

test('keeps users on login when demo credentials are invalid', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Senha').fill('not-the-demo-password');
  await page.getByRole('button', { name: /entrar no painel/i }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByText('Use a conta de demonstração para acessar o painel.')
  ).toBeVisible();
  await expect(page.getByLabel('E-mail')).toHaveValue(demoEmail);

  await page.getByLabel('Senha').fill('Dash2026!');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await signInWithDemoAccount(page);
  await expectDashboard(page);
});

test('requires credentials before attempting to sign in', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('E-mail').clear();
  await page.getByRole('button', { name: /entrar no painel/i }).click();

  await expect(page.getByLabel('E-mail')).toBeFocused();
  await expect(page).toHaveURL('/login');
  await expect(await getStoredSession(page)).toBeNull();

  await page.getByLabel('E-mail').fill(demoEmail);
  await page.getByLabel('Senha').clear();
  await page.getByRole('button', { name: /entrar no painel/i }).click();

  await expect(page.getByLabel('Senha')).toBeFocused();
  await expect(page).toHaveURL('/login');
  await expect(await getStoredSession(page)).toBeNull();
});

test('preserves the protected URL query and fragment after signing in', async ({ page }) => {
  await page.goto('/?view=events#overview');
  await expect(page).toHaveURL('/login');

  await signInWithDemoAccount(page);

  await expect(page).toHaveURL('/?view=events#overview');
  await expectDashboard(page);
});

test('redirects protected routes to login before returning to the dashboard', async ({
  page,
}) => {
  await page.goto('/events');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('E-mail')).toHaveValue(demoEmail);

  await signInWithDemoAccount(page);

  await expect(page).toHaveURL('/');
  await expectDashboard(page);
});

test('redirects authenticated users away from the public login route', async ({
  page,
}) => {
  await page.goto('/login');
  await signInWithDemoAccount(page);
  await expect(page).toHaveURL('/');
  await expectDashboard(page);

  await page.goto('/login');

  await expect(page).toHaveURL('/');
  await expectDashboard(page);
});

test('logs out and clears the persisted demo session', async ({ page }) => {
  await page.goto('/login');
  await signInWithDemoAccount(page);

  await expect(page).toHaveURL('/');
  await expect(await getStoredSession(page)).toContain(demoEmail);

  await page.getByText('Encerrar sessão', { exact: true }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: /entrar no painel/i })).toBeVisible();
  await expect(await getStoredSession(page)).toBeNull();
});

async function signInWithDemoAccount(page: Page) {
  await page.getByRole('button', { name: /entrar no painel/i }).click();
}

async function expectDashboard(page: Page) {
  await expect(
    page.getByRole('heading', { name: /visão operacional dos eventos de vendas/i })
  ).toBeVisible();
}

function getStoredSession(page: Page) {
  return page.evaluate((key) => localStorage.getItem(key), authStorageKey);
}
