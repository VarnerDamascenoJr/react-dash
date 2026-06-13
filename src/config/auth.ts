import type { AuthUser } from '../types';

const fallbackDemoUser: AuthUser = {
  name: 'Avery Stone',
  role: 'Operations Lead',
  email: 'admin@reactdash.dev',
  avatar:
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
};

export const demoLoginEmail =
  import.meta.env.VITE_DEMO_LOGIN_EMAIL ?? fallbackDemoUser.email;

export const demoLoginPassword =
  import.meta.env.VITE_DEMO_LOGIN_PASSWORD ?? 'Dash2026!';

export const demoUser: AuthUser = {
  name: import.meta.env.VITE_DEMO_USER_NAME ?? fallbackDemoUser.name,
  role: import.meta.env.VITE_DEMO_USER_ROLE ?? fallbackDemoUser.role,
  email: demoLoginEmail,
  avatar: import.meta.env.VITE_DEMO_USER_AVATAR ?? fallbackDemoUser.avatar,
};
