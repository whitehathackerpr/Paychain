import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, responsiveFontSizes, alpha } from '@mui/material';
import AppLayout from './components/AppLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import Receive from './pages/Receive';
import Transactions from './pages/Transactions';
import ScheduledPayments from './pages/ScheduledPayments';
import NFTReceipts from './pages/NFTReceipts';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import { usePayChainStore } from './store/paychainStore';

// Create a futuristic Web3 theme
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4F7CFF',
      light: '#7EBCFF',
      dark: '#2E56DB',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#03DAC6',
      light: '#70EFDE',
      dark: '#00B3A6',
      contrastText: '#000000',
    },
    background: {
      default: '#050b2e',
      paper: 'rgba(9, 14, 44, 0.6)',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#FFAB40',
    },
    info: {
      main: '#4FC3F7',
    },
    success: {
      main: '#00E676',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.95)',
      secondary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.4)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#4F7CFF #1a1035',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1a1035',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#4F7CFF',
            borderRadius: 6,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          backdropFilter: 'blur(4px)',
          transition: 'all 0.3s ease',
          boxShadow: 'none',
          padding: '10px 20px',
        },
        contained: {
          background: 'linear-gradient(90deg, #4F7CFF, #2E56DB)',
          boxShadow: '0 4px 14px 0 rgba(79, 124, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(90deg, #2E56DB, #4F7CFF)',
            boxShadow: '0 6px 20px 0 rgba(79, 124, 255, 0.5)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: alpha('#4F7CFF', 0.5),
          '&:hover': {
            borderColor: '#4F7CFF',
            boxShadow: '0 0 10px rgba(79, 124, 255, 0.3)',
            background: 'rgba(79, 124, 255, 0.05)',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(13, 17, 23, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          border: '1px solid rgba(79, 124, 255, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 32px 0 rgba(79, 124, 255, 0.2)',
            transform: 'translateY(-5px)',
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: 20,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
        title: {
          fontWeight: 600,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(9, 14, 44, 0.4)',
            backdropFilter: 'blur(4px)',
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(79, 124, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4F7CFF',
              borderWidth: '2px',
              boxShadow: '0 0 10px rgba(79, 124, 255, 0.2)',
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          borderRadius: 8,
          '&:hover': {
            background: 'rgba(79, 124, 255, 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filled: {
          background: 'rgba(79, 124, 255, 0.2)',
          backdropFilter: 'blur(4px)',
          '&:hover': {
            background: 'rgba(79, 124, 255, 0.3)',
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: 'rgba(255, 255, 255, 0.5)',
          '&.Mui-checked': {
            color: '#4F7CFF',
          },
          '&.Mui-checked + .MuiSwitch-track': {
            backgroundColor: 'rgba(79, 124, 255, 0.5)',
          },
        },
        track: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(90deg, #7EBCFF, #4F7CFF)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      lineHeight: 1.7,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
});

// Make typography responsive
theme = responsiveFontSizes(theme);

const App: React.FC = () => {
  const { isAuthenticated } = usePayChainStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Dashboard />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/payment"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Payment />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/receive"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Receive />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/transactions"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Transactions />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/scheduled-payments"
          element={
            isAuthenticated ? (
              <AppLayout>
                <ScheduledPayments />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/nft-receipts"
          element={
            isAuthenticated ? (
              <AppLayout>
                <NFTReceipts />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Profile />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            isAuthenticated ? (
              <AppLayout>
                <Settings />
              </AppLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirect to dashboard if authenticated, otherwise to login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App; 