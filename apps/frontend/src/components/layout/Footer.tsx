import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Link as MuiLink, 
  Typography, 
  Divider,
  useTheme,
  IconButton
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Facebook as FacebookIcon, 
  Twitter as TwitterIcon, 
  LinkedIn as LinkedInIcon, 
  GitHub as GitHubIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Shop',
      links: [
        { text: 'All Products', to: '/catalog' },
        { text: 'New Arrivals', to: '/catalog?sort=newest' },
        { text: 'Featured', to: '/catalog?featured=true' },
        { text: 'Deals', to: '/deals' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About Us', to: '/about' },
        { text: 'Careers', to: '/careers' },
        { text: 'Press', to: '/press' },
        { text: 'Blog', to: '/blog' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Help Center', to: '/help' },
        { text: 'Contact Us', to: '/contact' },
        { text: 'Shipping Info', to: '/shipping' },
        { text: 'Returns & Exchanges', to: '/returns' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { text: 'Terms of Service', to: '/terms' },
        { text: 'Privacy Policy', to: '/privacy' },
        { text: 'Cookie Policy', to: '/cookies' },
        { text: 'Sitemap', to: '/sitemap' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.secondary,
        borderTop: `1px solid ${theme.palette.divider}`,
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Logo and description */}
          <Grid item xs={12} md={6} lg={3}>
            <Typography 
              variant="h6" 
              color="primary" 
              gutterBottom 
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                textDecoration: 'none',
                display: 'block',
                mb: 2,
              }}
            >
              TM Forum Connect
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Empowering digital transformation through open APIs and collaboration.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton 
                aria-label="Facebook" 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener"
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                aria-label="Twitter" 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener"
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                aria-label="LinkedIn" 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener"
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton 
                aria-label="GitHub" 
                href="https://github.com" 
                target="_blank" 
                rel="noopener"
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <GitHubIcon />
              </IconButton>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <EmailIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
              <MuiLink href="mailto:info@tmforum.org" color="inherit" variant="body2">
                info@tmforum.org
              </MuiLink>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
              <MuiLink href="tel:+1234567890" color="inherit" variant="body2">
                +1 (234) 567-890
              </MuiLink>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LocationIcon sx={{ mr: 1, mt: 0.5, fontSize: '1rem', color: 'text.secondary' }} />
              <Typography variant="body2">
                1234 Digital Street<br />
                San Francisco, CA 94103
              </Typography>
            </Box>
          </Grid>
          
          {/* Footer links */}
          {footerLinks.map((column) => (
            <Grid item xs={6} md={3} key={column.title}>
              <Typography 
                variant="subtitle2" 
                component="h3" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2, 
                  color: 'text.primary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontSize: '0.8rem',
                }}
              >
                {column.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {column.links.map((link) => (
                  <li key={link.text}>
                    <MuiLink
                      component={RouterLink}
                      to={link.to}
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        display: 'block',
                        py: 0.5,
                        textDecoration: 'none',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {link.text}
                    </MuiLink>
                  </li>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Copyright and bottom links */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} TM Forum Connect. All rights reserved.
          </Typography>
          
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <MuiLink 
              component={RouterLink} 
              to="/privacy" 
              variant="body2" 
              color="text.secondary"
              sx={{ mx: 1 }}
            >
              Privacy Policy
            </MuiLink>
            <MuiLink 
              component={RouterLink} 
              to="/terms" 
              variant="body2" 
              color="text.secondary"
              sx={{ mx: 1 }}
            >
              Terms of Service
            </MuiLink>
            <MuiLink 
              component={RouterLink} 
              to="/cookies" 
              variant="body2" 
              color="text.secondary"
              sx={{ mx: 1 }}
            >
              Cookie Policy
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
