import type { ReactNode } from 'react';

export interface DarkModeState {
  darkMode: boolean;
}

export type DarkModeAction =
  | { type: 'LIGHT' }
  | { type: 'DARK' }
  | { type: 'TOGGLE' };

export interface DarkModeContextValue extends DarkModeState {
  dispatch: (action: DarkModeAction) => void;
}

export interface FormInput {
  id: number;
  label: string;
  type: string;
  placeholder?: string;
}

export interface NewPageProps {
  inputs?: FormInput[];
  title?: string;
}

export type WidgetType = 'user' | 'order' | 'earnings' | 'balance';

export interface WidgetData {
  title: string;
  isMoney: boolean;
  link: string;
  icon: ReactNode;
}

export interface UserRow {
  id: number;
  username: string;
  img: string;
  email: string;
  status: 'active' | 'passive' | 'pending';
  age: number;
}

export interface AuthUser {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginFormValues) => Promise<void>;
  logout: () => void;
}
