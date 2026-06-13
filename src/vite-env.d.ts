/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_LOGIN_EMAIL?: string;
  readonly VITE_DEMO_LOGIN_PASSWORD?: string;
  readonly VITE_DEMO_USER_NAME?: string;
  readonly VITE_DEMO_USER_ROLE?: string;
  readonly VITE_DEMO_USER_AVATAR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css';
declare module '*.scss';
