import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  InputBase,
  alpha,
  Container
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  ShoppingCart as ShoppingCartIcon, 
  Person as PersonIcon,
  FavoriteBorder as FavoriteIcon,
  ExitToApp as LogoutIcon,
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);
  
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isAuthenticated ? (
        <>
          <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
            <ListItemIcon>
              <AccountIcon fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>
          {user?.role === 'ADMIN' && (
            <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
              <ListItemIcon>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              Admin Dashboard
            </MenuItem>
          )}
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </>
      ) : (
        <MenuItem onClick={() => { navigate('/login'); handleMenuClose(); }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Login / Register
        </MenuItem>
      )}
    </Menu>
  );
  
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
              mr: 3,
            }}
          >
            TM Forum Connect
          </Typography>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', flexGrow: 1, ml: 3 }}>
              <Button
                component={RouterLink}
                to="/catalog"
                sx={{ my: 2, color: 'text.primary', display: 'block' }}
              >
                Products
              </Button>
              <Button
                component={RouterLink}
                to="/solutions"
                sx={{ my: 2, color: 'text.primary', display: 'block' }}
              >
                Solutions
              </Button>
              <Button
                component={RouterLink}
                to="/partners"
                sx={{ my: 2, color: 'text.primary', display: 'block' }}
              >
                Partners
              </Button>
            </Box>
          )}
          
          {/* Search */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: theme.shape.borderRadius,
              backgroundColor: alpha(theme.palette.common.black, 0.05),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.black, 0.1),
              },
              marginRight: theme.spacing(2),
              marginLeft: 0,
              width: '100%',
              [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
              },
              maxWidth: 500,
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search products..."
              sx={{
                color: 'inherit',
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                transition: theme.transitions.create('width'),
                width: '100%',
                [theme.breakpoints.up('md')]: {
                  width: '20ch',
                  '&:focus': {
                    width: '30ch',
                  },
                },
              }}
            />
          </Box>
          
          {/* Icons */}
          <Box sx={{ display: 'flex' }}>
            <IconButton 
              size="large" 
              color="inherit"
              component={RouterLink}
              to="/wishlist"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <FavoriteIcon />
            </IconButton>
            
            <IconButton 
              size="large" 
              color="inherit"
              component={RouterLink}
              to="/cart"
            >
              <Badge badgeContent={itemCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {isAuthenticated && user?.avatar ? (
                <Avatar 
                  alt={user.name || 'User'} 
                  src={user.avatar} 
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ width: 32, height: 32 }}>
                  <PersonIcon />
                </Avatar>
              )}
            </IconButton>
          </Box>
        </Toolbar>
        
        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <Box sx={{ pb: 2, px: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Button
              component={RouterLink}
              to="/catalog"
              fullWidth
              sx={{ justifyContent: 'flex-start', mb: 1 }}
            >
              Products
            </Button>
            <Button
              component={RouterLink}
              to="/solutions"
              fullWidth
              sx={{ justifyContent: 'flex-start', mb: 1 }}
            >
              Solutions
            </Button>
            <Button
              component={RouterLink}
              to="/partners"
              fullWidth
              sx={{ justifyContent: 'flex-start', mb: 1 }}
            >
              Partners
            </Button>
            {isAuthenticated && (
              <>
                <Divider sx={{ my: 1 }} />
                <Button
                  component={RouterLink}
                  to="/profile"
                  fullWidth
                  sx={{ justifyContent: 'flex-start', mb: 1 }}
                >
                  My Profile
                </Button>
                {user?.role === 'ADMIN' && (
                  <Button
                    component={RouterLink}
                    to="/admin"
                    fullWidth
                    sx={{ justifyContent: 'flex-start', mb: 1 }}
                  >
                    Admin Dashboard
                  </Button>
                )}
                <Button
                  onClick={handleLogout}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        )}
      </Container>
      
      {renderMenu}
    </AppBar>
  );
};

export default Header;
