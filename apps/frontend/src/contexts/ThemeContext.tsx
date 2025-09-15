import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// This function ensures we're in a browser environment
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) return savedTheme;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Set initial theme on mount
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    
    // Add listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setIsMounted(true);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update document class and save preference when theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Update data-theme attribute for potential CSS usage
    root.setAttribute('data-theme', theme);
    
    // Save preference
    localStorage.setItem('theme', theme);
    
    // Update CSS variables based on theme
    const style = document.documentElement.style;
    if (theme === 'dark') {
      style.colorScheme = 'dark';
    } else {
      style.colorScheme = 'light';
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Prevent hydration mismatch by only rendering children after mount
  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      isDarkMode: theme === 'dark' 
    }}>
      {children}
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

// Add this to your global CSS file
// :root {
//   /* Light theme colors */
//   --background: #ffffff;
//   --foreground: #1a1a1a;
//   /* Add more color variables as needed */
// }

// .dark {
//   /* Dark theme colors */
//   --background: #1a1a1a;
//   --foreground: #ffffff;
//   /* Add more color variables as needed */
// }
