import { createTheme, ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { createContext, useMemo, useState, useEffect, ReactNode, useContext } from 'react';
import { getTheme } from '@/theme';

type ThemeContextType = {
  theme: Theme;
  mode: PaletteMode;
  toggleColorMode: () => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// This function ensures we're in a browser environment
const getInitialMode = (): PaletteMode => {
  if (typeof window === 'undefined') return 'light';
  
  const savedMode = localStorage.getItem('theme') as PaletteMode | null;
  if (savedMode) return savedMode;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Set initial theme on mount
  useEffect(() => {
    const initialMode = getInitialMode();
    setMode(initialMode);
    
    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setIsMounted(true);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme', newMode);
          return newMode;
        });
      },
    }),
    []
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Update document class and save preference when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Update data-theme attribute for potential CSS usage
    root.setAttribute('data-theme', mode);
    
    // Update CSS color scheme for form controls
    const style = document.documentElement.style;
    style.colorScheme = mode;
  }, [mode]);

  // Prevent hydration mismatch by only rendering children after mount
  if (!isMounted) {
    return null;
  }

  const contextValue = {
    theme,
    mode,
    toggleColorMode: colorMode.toggleColorMode,
    isDarkMode: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Global CSS variables for non-MUI components
const globalStyles = `
  :root {
    --primary-main: #00A76F;
    --primary-light: #5BE49B;
    --primary-dark: #007867;
    --secondary-main: #8E33FF;
    --secondary-light: #C684FF;
    --secondary-dark: #5119B7;
    --error-main: #FF5630;
    --warning-main: #FFAB00;
    --info-main: #00B8D9;
    --success-main: #36B37E;
    --text-primary: #212B36;
    --text-secondary: #637381;
    --background-default: #F4F6F8;
    --background-paper: #FFFFFF;
    --divider: rgba(145, 158, 171, 0.24);
  }

  [data-theme="dark"] {
    --primary-main: #5BE49B;
    --primary-light: #C8FAD6;
    --primary-dark: #007867;
    --secondary-main: #C684FF;
    --secondary-light: #EFD6FF;
    --secondary-dark: #5119B7;
    --error-main: #FFAC82;
    --warning-main: #FFD666;
    --info-main: #61F3F3;
    --success-main: #86E8AB;
    --text-primary: #FFFFFF;
    --text-secondary: #919EAB;
    --background-default: #121212;
    --background-paper: #1E1E1E;
    --divider: rgba(145, 158, 171, 0.16);
  }
`;

// Add global styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}
