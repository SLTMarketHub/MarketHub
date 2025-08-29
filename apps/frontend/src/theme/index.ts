import { createTheme, responsiveFontSizes, PaletteMode } from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      card: string;
      dropdown: string;
      dialog: string;
    };
  }
  
  interface ThemeOptions {
    customShadows?: {
      card?: string;
      dropdown?: string;
      dialog?: string;
    };
  }
}

const getTheme = (mode: PaletteMode = 'light') => {
  const isLight = mode === 'light';
  
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#00A76F',
        light: '#5BE49B',
        dark: '#007867',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#8E33FF',
        light: '#C684FF',
        dark: '#5119B7',
        contrastText: '#FFFFFF',
      },
      error: {
        main: '#FF5630',
        light: '#FFAC82',
        dark: '#B71D18',
      },
      warning: {
        main: '#FFAB00',
        light: '#FFD666',
        dark: '#B76E00',
      },
      info: {
        main: '#00B8D9',
        light: '#61F3F3',
        dark: '#006C9C',
      },
      success: {
        main: '#36B37E',
        light: '#86E8AB',
        dark: '#1B806A',
      },
      background: {
        default: isLight ? '#F4F6F8' : '#121212',
        paper: isLight ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: isLight ? '#212B36' : '#FFFFFF',
        secondary: isLight ? '#637381' : '#919EAB',
        disabled: isLight ? '#919EAB' : '#637381',
      },
    },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2.5rem', lineHeight: 1.2 },
      h2: { fontWeight: 700, fontSize: '2rem', lineHeight: 1.2 },
      h3: { fontWeight: 700, fontSize: '1.75rem', lineHeight: 1.5 },
      h4: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.5 },
      h5: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.5 },
      h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
          sizeLarge: { padding: '10px 24px', fontSize: '1rem' },
          sizeSmall: { padding: '6px 12px', fontSize: '0.875rem' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { 
            borderRadius: 16,
            boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
            '&:hover': { boxShadow: '0 8px 24px 0 rgba(0,0,0,0.1)' }
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundColor: isLight ? '#FFFFFF' : '#1E1E1E' },
        },
      },
    },
    customShadows: {
      card: '0 4px 20px 0 rgba(0,0,0,0.05)',
      dropdown: '0 8px 16px 0 rgba(0,0,0,0.1)',
      dialog: '0 24px 48px 0 rgba(0,0,0,0.15)',
    },
  });

  return responsiveFontSizes(theme);
};

export { getTheme };
export default getTheme;
