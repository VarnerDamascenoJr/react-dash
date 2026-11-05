import { createContext, useReducer } from 'react';
import darkModeReducer from './darkModeReducer';
import type { DarkModeContextProviderProps, DarkModeContextValue, DarkModeState } from './darkMode.types';

const initialState: DarkModeState = {
  darkMode: false,
};

const defaultContextValue: DarkModeContextValue = {
  ...initialState,
  dispatch: () => undefined,
};

export const DarkModeContext =
  createContext<DarkModeContextValue>(defaultContextValue);

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
