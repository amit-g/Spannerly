import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useAppSelector } from '@/store/hooks';
import { createAppTheme } from '@/utils/theme';
import { useThemePersistence } from '@/hooks/useThemePersistence';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  useThemePersistence(); // Load and save theme preferences
  const themeState = useAppSelector((state: any) => state.theme);
  const theme = createAppTheme(themeState);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
