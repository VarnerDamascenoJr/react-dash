import { getLoginRedirect } from './loginRedirect';

test('preserves path, query parameters and fragment from a protected location', () => {
  expect(getLoginRedirect({ from: { pathname: '/', search: '?view=events', hash: '#overview' } }))
    .toEqual({ pathname: '/', search: '?view=events', hash: '#overview' });
});

test.each([
  null,
  'invalid state',
  { from: null },
  { from: { pathname: 123 } },
  { from: { pathname: 'https://example.com' } },
  { from: { pathname: '//example.com' } },
  { from: { pathname: '/\\example.com' } },
  { from: { pathname: '/login' } },
  { from: { pathname: '/LOGIN/' } },
])('falls back to the dashboard for an invalid destination: %j', (state) => {
  expect(getLoginRedirect(state)).toEqual({ pathname: '/', search: '', hash: '' });
});

test('ignores malformed optional location fields', () => {
  expect(getLoginRedirect({ from: { pathname: '/', search: 123, hash: null } }))
    .toEqual({ pathname: '/', search: '', hash: '' });
});
