import {
  createContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthContextValue, AuthUser, LoginFormValues } from '../types';
import { demoLoginPassword, demoUser } from '../config/auth';

const AUTH_STORAGE_KEY = 'react-dash.auth.user';

const defaultContextValue: AuthContextValue = {
  user: null,
  isAuthenticated: false,
  login: async () => undefined,
  logout: () => undefined,
};

export const AuthContext =
  createContext<AuthContextValue>(defaultContextValue);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({
  children,
}: AuthContextProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? (JSON.parse(storedUser) as AuthUser) : null;
  });

  const login = async ({ email, password }: LoginFormValues) => {
    const normalizedEmail = email.trim().toLowerCase();

    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });

    if (
      normalizedEmail !== demoUser.email ||
      password.trim() !== demoLoginPassword
    ) {
      throw new Error('Use the demo account to access the dashboard.');
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
