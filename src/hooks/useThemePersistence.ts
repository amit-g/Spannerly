import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setThemeMode, setColorScheme } from '@/store/themeSlice';

const THEME_STORAGE_KEY = 'spannerly-theme';

export const useThemePersistence = () => {
  const dispatch = useAppDispatch();
  const themeState = useAppSelector((state: any) => state.theme);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const parsed = JSON.parse(savedTheme);
        if (parsed.mode) {
          dispatch(setThemeMode(parsed.mode));
        }
        if (parsed.colorScheme) {
          dispatch(setColorScheme(parsed.colorScheme));
        }
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
  }, [dispatch]);

  // Save theme to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeState));
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [themeState]);
};
