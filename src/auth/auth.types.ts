import type { ReactNode } from 'react';

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

export interface AuthContextProviderProps {
  children: ReactNode;
}
