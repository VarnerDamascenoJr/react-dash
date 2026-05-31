import { createContext, useReducer, type ReactNode } from 'react';
import darkModeReducer from './darkModeReducer';
import type { DarkModeContextValue, DarkModeState } from '../types';

const initialState: DarkModeState = {
  darkMode: false,
};

const defaultContextValue: DarkModeContextValue = {
  ...initialState,
  dispatch: () => undefined,
};

export const DarkModeContext =
  createContext<DarkModeContextValue>(defaultContextValue);

interface DarkModeContextProviderProps {
  children: ReactNode;
}

export const DarkModeContextProvider = ({
  children,
}: DarkModeContextProviderProps) => {
  const [state, dispatch] = useReducer(darkModeReducer, initialState);

  return (
    <DarkModeContext.Provider value={{ darkMode: state.darkMode, dispatch }}>
      {children}
    </DarkModeContext.Provider>
  );
};
