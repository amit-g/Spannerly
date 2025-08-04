import themeReducer, { setThemeMode, setColorScheme, toggleThemeMode } from '@/store/themeSlice';
import { ThemeState } from '@/types';

describe('themeSlice', () => {
  const initialState: ThemeState = {
    mode: 'light',
    colorScheme: 'blue',
  };

  it('should return the initial state', () => {
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setThemeMode', () => {
    const action = setThemeMode('dark');
    const newState = themeReducer(initialState, action);
    expect(newState.mode).toBe('dark');
  });

  it('should handle setColorScheme', () => {
    const action = setColorScheme('green');
    const newState = themeReducer(initialState, action);
    expect(newState.colorScheme).toBe('green');
  });

  it('should handle toggleThemeMode from light to dark', () => {
    const action = toggleThemeMode();
    const newState = themeReducer(initialState, action);
    expect(newState.mode).toBe('dark');
  });

  it('should handle toggleThemeMode from dark to light', () => {
    const darkState: ThemeState = { mode: 'dark', colorScheme: 'blue' };
    const action = toggleThemeMode();
    const newState = themeReducer(darkState, action);
    expect(newState.mode).toBe('light');
  });

  it('should preserve other properties when changing mode', () => {
    const action = setThemeMode('dark');
    const newState = themeReducer(initialState, action);
    expect(newState.colorScheme).toBe('blue');
  });

  it('should preserve other properties when changing color scheme', () => {
    const action = setColorScheme('purple');
    const newState = themeReducer(initialState, action);
    expect(newState.mode).toBe('light');
  });
});
