import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton,
  useMediaQuery,
  Divider,
  Avatar,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  Payment as PaymentIcon, 
  History as HistoryIcon, 
  Receipt as ReceiptIcon,
  Logout as LogoutIcon,
  AccountBalanceWallet as WalletIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePayChainStore } from '../store/paychainStore';

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout } = usePayChainStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Send Payment', icon: <PaymentIcon />, path: '/payment' },
    { text: 'Transactions', icon: <HistoryIcon />, path: '/transactions' },
    { text: 'NFT Receipts', icon: <ReceiptIcon />, path: '/nft-receipts' },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            background: 'linear-gradient(45deg, #3F88F6 30%, #6AB8FF 90%)',
          }}
        >
          <WalletIcon />
        </Avatar>
        <Typography 
          variant="h6" 
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(90deg, #3F88F6, #9c27b0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          PayChain
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List component="nav">
        {menuItems.map((item) => (
          <motion.div
            key={item.text}
            whileHover={{ 
              x: 6,
              transition: { duration: 0.2 }
            }}
          >
            <ListItem
              button
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                mb: 1,
                mx: 1,
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.25),
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '4px',
                    height: '100%',
                    left: 0,
                    top: 0,
                    background: 'linear-gradient(45deg, #3F88F6 30%, #6AB8FF 90%)',
                    borderRadius: '0 4px 4px 0',
                  }
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 500 : 400,
                }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Divider sx={{ mt: 2 }} />
      
      <List>
        <Tooltip title="Logout">
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{ 
              py: 1.5, 
              color: theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.error.main,
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </Tooltip>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit">
              <SettingsIcon />
            </IconButton>
            <Avatar
              alt="User"
              src="/avatar.png"
              sx={{ 
                width: 40, 
                height: 40,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  border: `2px solid ${theme.palette.primary.main}`,
                }
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 8, sm: 9 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <div>{children}</div>
      </Box>
    </Box>
  );
} 