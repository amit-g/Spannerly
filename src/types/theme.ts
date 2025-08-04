export interface ThemeState {
  mode: 'light' | 'dark';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export interface ThemeSettings {
  name: string;
  mode: 'light' | 'dark';
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  primary: string;
  secondary: string;
}
