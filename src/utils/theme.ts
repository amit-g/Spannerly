import { createTheme, Theme } from '@mui/material/styles';
import { ThemeState } from '@/types';

const colorSchemes = {
  blue: {
    light: { primary: '#1976d2', secondary: '#dc004e' },
    dark: { primary: '#90caf9', secondary: '#f48fb1' }
  },
  green: {
    light: { primary: '#2e7d32', secondary: '#ff6f00' },
    dark: { primary: '#66bb6a', secondary: '#ffb74d' }
  },
  purple: {
    light: { primary: '#7b1fa2', secondary: '#d32f2f' },
    dark: { primary: '#ba68c8', secondary: '#ef5350' }
  },
  orange: {
    light: { primary: '#f57c00', secondary: '#1976d2' },
    dark: { primary: '#ffb74d', secondary: '#64b5f6' }
  },
  red: {
    light: { primary: '#d32f2f', secondary: '#388e3c' },
    dark: { primary: '#ef5350', secondary: '#66bb6a' }
  }
};

export const createAppTheme = (themeState: ThemeState): Theme => {
  const colors = colorSchemes[themeState.colorScheme][themeState.mode];
  
  return createTheme({
    palette: {
      mode: themeState.mode,
      primary: {
        main: colors.primary,
      },
      secondary: {
        main: colors.secondary,
      },
      ...(themeState.mode === 'dark' && {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      }),
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: themeState.mode === 'light' 
              ? '0 2px 8px rgba(0,0,0,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
      },
    },
  });
};

export const themePresets = [
  { name: 'Ocean Blue', mode: 'light' as const, colorScheme: 'blue' as const },
  { name: 'Ocean Blue Dark', mode: 'dark' as const, colorScheme: 'blue' as const },
  { name: 'Forest Green', mode: 'light' as const, colorScheme: 'green' as const },
  { name: 'Forest Green Dark', mode: 'dark' as const, colorScheme: 'green' as const },
  { name: 'Royal Purple', mode: 'light' as const, colorScheme: 'purple' as const },
  { name: 'Royal Purple Dark', mode: 'dark' as const, colorScheme: 'purple' as const },
  { name: 'Sunset Orange', mode: 'light' as const, colorScheme: 'orange' as const },
  { name: 'Sunset Orange Dark', mode: 'dark' as const, colorScheme: 'orange' as const },
  { name: 'Ruby Red', mode: 'light' as const, colorScheme: 'red' as const },
  { name: 'Ruby Red Dark', mode: 'dark' as const, colorScheme: 'red' as const },
];
