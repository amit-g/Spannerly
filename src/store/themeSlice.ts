import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState } from '@/types';

const initialState: ThemeState = {
  mode: 'light',
  colorScheme: 'blue',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state: ThemeState, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
    },
    setColorScheme: (state: ThemeState, action: PayloadAction<'blue' | 'green' | 'purple' | 'orange' | 'red'>) => {
      state.colorScheme = action.payload;
    },
    toggleThemeMode: (state: ThemeState) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setThemeMode, setColorScheme, toggleThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
