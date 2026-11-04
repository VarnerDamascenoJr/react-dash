import type { Path } from 'react-router-dom';

export function getLoginRedirect(state: unknown): Path {
  const fallback = { pathname: '/', search: '', hash: '' };
  if (!state || typeof state !== 'object' || !('from' in state)) return fallback;

  const from = state.from;
  if (!from || typeof from !== 'object' || !('pathname' in from)) return fallback;

  const { pathname } = from;
  if (
    typeof pathname !== 'string' ||
    !pathname.startsWith('/') ||
    pathname.startsWith('//') ||
    pathname.includes('\\') ||
    /^\/login\/*$/i.test(pathname)
  ) {
    return fallback;
  }

  return {
    pathname,
    search: 'search' in from && typeof from.search === 'string' ? from.search : '',
    hash: 'hash' in from && typeof from.hash === 'string' ? from.hash : '',
  };
}
