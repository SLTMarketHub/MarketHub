import React, { useState } from 'react';
import { 
  Drawer, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography, 
  Collapse, 
  useTheme,
  useMediaQuery,
  Theme,
  SvgIconProps,
  ListItemButton
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  ShoppingCart as OrdersIcon,
  Favorite as WishlistIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Category as CategoryIcon,
  Store as StoreIcon,
  People as PeopleIcon,
  Assessment as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Receipt as InvoicesIcon,
  CreditCard as PaymentsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type MenuItem = {
  title: string;
  path: string;
  icon: React.ReactElement<SvgIconProps>;
  children?: MenuItem[];
  role?: string[];
};

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const { logout, user } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  
  // Define menu items based on user role
  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      title: 'Products',
      path: '/products',
      icon: <StoreIcon />,
      children: [
        { title: 'All Products', path: '/products', icon: <CategoryIcon /> },
        { title: 'Categories', path: '/admin/categories', icon: <CategoryIcon />, role: ['ADMIN'] },
        { title: 'Inventory', path: '/inventory', icon: <CategoryIcon />, role: ['ADMIN', 'MANAGER'] },
      ],
    },
    {
      title: 'Orders',
      path: '/orders',
      icon: <OrdersIcon />,
      children: [
        { title: 'My Orders', path: '/orders', icon: <OrdersIcon /> },
        { title: 'Order History', path: '/orders/history', icon: <OrdersIcon /> },
        { title: 'Returns', path: '/returns', icon: <OrdersIcon /> },
      ],
    },
    {
      title: 'Customers',
      path: '/customers',
      icon: <PeopleIcon />,
      role: ['ADMIN', 'MANAGER'],
      children: [
        { title: 'All Customers', path: '/customers', icon: <PeopleIcon /> },
        { title: 'Customer Groups', path: '/customer-groups', icon: <PeopleIcon /> },
      ],
    },
    {
      title: 'Partners',
      path: '/partners',
      icon: <PeopleIcon />,
      role: ['ADMIN'],
      children: [
        { title: 'All Partners', path: '/partners', icon: <PeopleIcon /> },
        { title: 'Applications', path: '/partner/applications', icon: <PeopleIcon /> },
        { title: 'Commissions', path: '/partner/commissions', icon: <PaymentsIcon /> },
      ],
    },
    {
      title: 'Analytics',
      path: '/analytics',
      icon: <AnalyticsIcon />,
      role: ['ADMIN', 'MANAGER'],
    },
    {
      title: 'Notifications',
      path: '/notifications',
      icon: <NotificationsIcon />,
    },
    {
      title: 'Billing',
      path: '/billing',
      icon: <PaymentsIcon />,
      children: [
        { title: 'Invoices', path: '/billing/invoices', icon: <InvoicesIcon /> },
        { title: 'Payment Methods', path: '/billing/payment-methods', icon: <CreditCardIcon /> },
        { title: 'Billing History', path: '/billing/history', icon: <ReceiptLongIcon /> },
      ],
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <SettingsIcon />,
      children: [
        { title: 'Profile', path: '/settings/profile', icon: <PersonIcon /> },
        { title: 'Account', path: '/settings/account', icon: <SettingsIcon /> },
        { title: 'Preferences', path: '/settings/preferences', icon: <TuneIcon /> },
      ],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.role) return true;
    return user && item.role.includes(user.role);
  });

  const handleMenuClick = (title: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const drawerWidth = 240;

  const renderMenuItems = (items: MenuItem[], depth = 0) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isItemActive = isActive(item.path);
      const isMenuOpen = openMenus[item.title];
      
      return (
        <React.Fragment key={item.path}>
          <ListItem 
            disablePadding 
            sx={{ 
              '&:hover': { backgroundColor: 'action.hover' },
              backgroundColor: isItemActive ? 'action.selected' : 'transparent',
              borderRight: isItemActive ? `3px solid ${theme.palette.primary.main}` : 'none',
            }}
          >
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={() => hasChildren ? handleMenuClick(item.title) : null}
              sx={{
                pl: 2 + depth * 2,
                py: 1.25,
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: isItemActive ? 'primary.main' : 'text.secondary' }}>
                {React.cloneElement(item.icon, { fontSize: 'small' })}
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isItemActive ? 600 : 400 }}>
                    {item.title}
                  </Typography>
                } 
              />
              {hasChildren && (isMenuOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
            </ListItemButton>
          </ListItem>
          
          {hasChildren && (
            <Collapse in={isMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children || [], depth + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none',
          backgroundColor: theme.palette.background.default,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
      open={true}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo and app name */}
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
            minHeight: 64,
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
            TM Connect
          </Typography>
        </Box>
        
        {/* User info */}
        <Box 
          sx={{ 
            p: 2, 
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box 
            sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.contrastText',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role?.toLowerCase() || 'user'}
            </Typography>
          </Box>
        </Box>
        
        {/* Navigation */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
          <List>
            {renderMenuItems(filteredMenuItems)}
          </List>
        </Box>
        
        {/* Help and Logout */}
        <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 1 }}>
          <List>
            <ListItem 
              button 
              component={RouterLink}
              to="/help"
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="body2">
                    Help & Support
                  </Typography>
                } 
              />
            </ListItem>
            <ListItem 
              button 
              onClick={logout}
              sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography variant="body2">
                    Logout
                  </Typography>
                } 
              />
            </ListItem>
          </List>
          
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              v{process.env.REACT_APP_VERSION || '1.0.0'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
