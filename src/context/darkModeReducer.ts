import type { DarkModeAction, DarkModeState } from '../types';

const darkModeReducer = (
  state: DarkModeState,
  action: DarkModeAction
): DarkModeState => {
  switch (action.type) {
    case 'LIGHT':
      return { darkMode: false };
    case 'DARK':
      return { darkMode: true };
    case 'TOGGLE':
      return { darkMode: !state.darkMode };
    default:
      return state;
  }
};

export default darkModeReducer;
