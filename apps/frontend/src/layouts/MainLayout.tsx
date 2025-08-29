import React, { ReactNode } from 'react';
import { Box, Container, CssBaseline, useTheme } from '@mui/material';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      <Header />
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        {user && <Sidebar />}
        
        <Box 
          component="main" 
          sx={{
            flexGrow: 1,
            p: 3,
            width: '100%',
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="xl" sx={{ py: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default MainLayout;
