import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
  alpha,
  styled,
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Dashboard,
  Payment,
  Receipt,
  History,
  Schedule,
  Settings,
  AccountCircle,
  Notifications,
  Logout,
  Person,
  Security,
  Help,
  ChevronRight,
  Fingerprint,
  HexagonOutlined,
  Wallet
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePayChainStore } from '../store/paychainStore';

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(9, 14, 44, 0.4)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(79, 124, 255, 0.1)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
}));

const LogoText = styled(Typography)`
  font-weight: 700;
  background: linear-gradient(90deg, #7EBCFF, #4F7CFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: ${({ theme }) => theme.breakpoints.up('sm') ? 'block' : 'none'};
`;

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: 'linear-gradient(45deg, #FF512F, #F09819)',
    boxShadow: '0 0 10px rgba(255, 81, 47, 0.5)',
  },
}));

const IconButtonWithGlow = styled(IconButton)(({ theme }) => ({
  position: 'relative',
  color: 'rgba(255, 255, 255, 0.7)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.light,
    transform: 'translateY(-2px)',
    '&::after': {
      opacity: 0.8,
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.4)}`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
  }
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderBottom: `1px solid ${alpha('#fff', 0.05)}`,
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  background: 'linear-gradient(45deg, #4F7CFF 30%, #03DAC6 90%)',
  boxShadow: '0 3px 5px 2px rgba(79, 124, 255, .3)',
  border: '2px solid rgba(255, 255, 255, 0.1)',
}));

// Hexagon shaped background for menu items
const HexButton = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  cursor: 'pointer',
  width: '100%',
  marginBottom: theme.spacing(1),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    zIndex: -1,
    transition: 'all 0.3s ease',
  },
  '&:hover::before': {
    background: alpha(theme.palette.primary.main, 0.1),
    boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = usePayChainStore();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login');
  };

  const profileMenuItems = [
    { text: 'Profile', icon: <Person />, path: '/profile' },
    { text: 'Security', icon: <Security />, path: '/security' },
    { text: 'Help & Support', icon: <Help />, path: '/help' },
    { text: 'Logout', icon: <Logout />, onClick: handleLogout },
  ];

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate('/settings');
  };

  const navigationItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { text: 'Send Payment', path: '/payment', icon: <Payment /> },
    { text: 'Receive', path: '/receive', icon: <Receipt /> },
    { text: 'Transactions', path: '/transactions', icon: <Receipt /> },
    { text: 'Scheduled Payments', path: '/scheduled-payments', icon: <Schedule /> },
    { text: 'NFT Receipts', path: '/nft-receipts', icon: <Receipt /> },
    { text: 'Profile', path: '/profile', icon: <Person /> },
    { text: 'Settings', path: '/settings', icon: <Settings /> },
  ];

  const drawer = (
    <Box sx={{ 
      width: 280,
      height: '100%',
      background: 'linear-gradient(135deg, rgba(9, 14, 44, 0.95) 0%, rgba(13, 17, 53, 0.98) 100%)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(79, 124, 255, 0.1)',
    }}>
      <DrawerHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Wallet 
            sx={{
              fontSize: 30,
              color: '#4F7CFF',
              filter: 'drop-shadow(0 0 8px rgba(79, 124, 255, 0.6))'
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(90deg, #7EBCFF, #4F7CFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PayChain
          </Typography>
        </Box>
      </DrawerHeader>

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <UserAvatar>
          {user?.email?.[0].toUpperCase()}
        </UserAvatar>
        <Box>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
            {user?.email}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {user?.principalId?.substring(0, 8)}...
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
      <List sx={{ px: 2 }}>
        {navigationItems.map((item) => (
          <HexButton
            key={item.text}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <ListItem
              button
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                borderRadius: 2,
                position: 'relative',
                overflow: 'hidden',
                py: 1.5,
                pl: 2,
                ...(location.pathname === item.path && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: 4,
                    background: 'linear-gradient(to bottom, #4F7CFF, #03DAC6)',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: '0 0 10px rgba(79, 124, 255, 0.6)',
                  },
                  background: 'rgba(79, 124, 255, 0.1)',
                  '& .MuiListItemIcon-root': {
                    color: '#4F7CFF',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#4F7CFF',
                    fontWeight: 600,
                  },
                }),
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  '& .MuiTypography-root': {
                    fontWeight: 500,
                  },
                }}
              />
              <ChevronRight sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
            </ListItem>
          </HexButton>
        ))}
      </List>
      
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Fingerprint 
              sx={{ 
                mr: 1, 
                color: theme.palette.secondary.main,
                filter: `drop-shadow(0 0 5px ${alpha(theme.palette.secondary.main, 0.5)})`
              }}
            />
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              Secured by ICP
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>
            v1.0.4
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <GlassAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Wallet 
              sx={{
                mr: 1,
                fontSize: 24,
                color: '#4F7CFF',
                filter: 'drop-shadow(0 0 8px rgba(79, 124, 255, 0.6))',
                display: { xs: 'none', sm: 'block' }
              }}
            />
            <LogoText variant="h6">
              PayChain
            </LogoText>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {navigationItems.map((item) => (
                <motion.div
                  key={item.text}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tooltip title={item.text}>
                    <IconButtonWithGlow
                      onClick={() => navigate(item.path)}
                      sx={{
                        color: location.pathname === item.path ? '#4F7CFF' : 'rgba(255, 255, 255, 0.7)',
                        ...(location.pathname === item.path && {
                          '&::after': {
                            opacity: 0.6,
                          }
                        }),
                      }}
                    >
                      {item.icon}
                    </IconButtonWithGlow>
                  </Tooltip>
                </motion.div>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButtonWithGlow onClick={handleNotificationsOpen}>
                <StyledBadge badgeContent={3} color="error">
                  <Notifications />
                </StyledBadge>
              </IconButtonWithGlow>
            </Tooltip>

            <Tooltip title="Account settings">
              <IconButtonWithGlow onClick={handleProfileMenuOpen}>
                <UserAvatar
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.email?.[0].toUpperCase()}
                </UserAvatar>
              </IconButtonWithGlow>
            </Tooltip>
          </Box>
        </Toolbar>
      </GlassAppBar>

      <Box
        component="nav"
        sx={{ width: { sm: 280 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 280,
              border: 'none',
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
              width: 280,
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            background: 'rgba(9, 14, 44, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(79, 124, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          }
        }}
      >
        {profileMenuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              } else if (item.path) {
                navigate(item.path);
              }
              handleMenuClose();
            }}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              py: 1,
              '&:hover': {
                background: 'rgba(79, 124, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {item.icon}
            </ListItemIcon>
            {item.text}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            background: 'rgba(9, 14, 44, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(79, 124, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            width: 320,
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>
        <MenuItem sx={{ color: 'rgba(255, 255, 255, 0.7)', py: 1.5 }}>
          <ListItemIcon>
            <Badge
              variant="dot"
              color="secondary"
              sx={{ '& .MuiBadge-badge': { boxShadow: '0 0 10px rgba(3, 218, 198, 0.5)' } }}
            >
              <Payment sx={{ color: '#03DAC6' }} />
            </Badge>
          </ListItemIcon>
          <ListItemText 
            primary="New Payment Received"
            secondary="You received 0.5 ICP from Alice"
            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}
          />
        </MenuItem>
        <MenuItem sx={{ color: 'rgba(255, 255, 255, 0.7)', py: 1.5 }}>
          <ListItemIcon>
            <Badge
              variant="dot"
              color="info"
              sx={{ '& .MuiBadge-badge': { boxShadow: '0 0 10px rgba(79, 195, 247, 0.5)' } }}
            >
              <Schedule sx={{ color: '#4FC3F7' }} />
            </Badge>
          </ListItemIcon>
          <ListItemText 
            primary="Scheduled Payment"
            secondary="Your payment to Bob is scheduled for tomorrow"
            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}
          />
        </MenuItem>
        <MenuItem sx={{ color: 'rgba(255, 255, 255, 0.7)', py: 1.5 }}>
          <ListItemIcon>
            <Badge
              variant="dot"
              color="success"
              sx={{ '& .MuiBadge-badge': { boxShadow: '0 0 10px rgba(0, 230, 118, 0.5)' } }}
            >
              <Receipt sx={{ color: '#00E676' }} />
            </Badge>
          </ListItemIcon>
          <ListItemText 
            primary="NFT Minted"
            secondary="Your payment receipt has been minted as an NFT"
            secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' }}
          />
        </MenuItem>
        <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              color: theme.palette.primary.main,
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline',
              }
            }}
          >
            View all notifications
          </Typography>
        </Box>
      </Menu>

      <Toolbar /> {/* Spacer for fixed AppBar */}
    </>
  );
} 