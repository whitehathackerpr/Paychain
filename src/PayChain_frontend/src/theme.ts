import { createTheme, alpha } from '@mui/material';

// Create theme
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3F88F6',
      light: '#6AB8FF',
      dark: '#0066c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#bb4FD3',
      dark: '#7B1FA2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    error: {
      main: '#FF5252',
    },
    warning: {
      main: '#FFC107',
    },
    success: {
      main: '#4CAF50',
    },
    info: {
      main: '#2196F3',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 20px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 15px rgba(63, 136, 246, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3F88F6 30%, #6AB8FF 90%)',
          boxShadow: '0 4px 10px rgba(63, 136, 246, 0.25)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #9c27b0 30%, #bb4FD3 90%)',
          boxShadow: '0 4px 10px rgba(156, 39, 176, 0.25)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(30, 30, 30, 0.8)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(90deg, #3F88F6, #9c27b0)',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(63, 136, 246, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 75%, rgba(156, 39, 176, 0.1) 0%, transparent 40%), linear-gradient(180deg, #121212 0%, #20202F 100%)',
          backgroundAttachment: 'fixed',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1E1E1E',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#3F88F6',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#6AB8FF',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(18, 18, 18, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        filledPrimary: {
          background: 'linear-gradient(45deg, #3F88F6 30%, #6AB8FF 90%)',
        },
        filledSecondary: {
          background: 'linear-gradient(45deg, #9c27b0 30%, #bb4FD3 90%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.15)',
              transition: 'all 0.2s ease-in-out',
            },
            '&:hover fieldset': {
              borderColor: alpha('#3F88F6', 0.5),
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3F88F6',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        },
        elevation3: {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
        },
        elevation4: {
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(18, 18, 18, 0.5)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'background-color 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: alpha('#3F88F6', 0.15),
            '&:hover': {
              backgroundColor: alpha('#3F88F6', 0.25),
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 6,
          backdropFilter: 'blur(10px)',
          backgroundColor: alpha('#1E1E1E', 0.9),
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          padding: '8px 12px',
          fontSize: '0.75rem',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha('#121212', 0.8),
          backdropFilter: 'blur(4px)',
        },
      },
    },
  },
}); 