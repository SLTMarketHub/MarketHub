import React, { ReactNode } from 'react';
import { Box, Container, CssBaseline, useTheme } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      <Header />
      
      <Box 
        component="main" 
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.background.default,
          py: 8,
        }}
      >
        <Container maxWidth="sm">
          {children}
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default AuthLayout;
