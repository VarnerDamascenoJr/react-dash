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

export interface DarkModeContextProviderProps {
  children: ReactNode;
}
