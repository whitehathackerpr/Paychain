import { createTheme, alpha } from '@mui/material/styles';

// Create theme
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366F1', // Indigo
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#10B981', // Emerald
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#06051F', // Deep space blue
      paper: 'rgba(15, 23, 42, 0.8)', // Transparent slate with opacity
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    info: {
      main: '#0EA5E9',
      light: '#38BDF8',
      dark: '#0284C7',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#E5E7EB',
      disabled: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
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
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    body1: {
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'radial-gradient(circle at 10% 20%, #111827 0%, #06051F 100%)',
          backgroundAttachment: 'fixed',
          '&:before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backgroundImage: 
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'400\' viewBox=\'0 0 800 800\'%3E%3Cg fill=\'none\' stroke=\'%23212F45\' stroke-width=\'1\'%3E%3Cpath d=\'M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63\'/%3E%3Cpath d=\'M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764\'/%3E%3Cpath d=\'M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880\'/%3E%3Cpath d=\'M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382\'/%3E%3Cpath d=\'M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269\'/%3E%3C/g%3E%3Cg fill=\'%23313862\'%3E%3Ccircle cx=\'769\' cy=\'229\' r=\'5\'/%3E%3Ccircle cx=\'539\' cy=\'269\' r=\'5\'/%3E%3Ccircle cx=\'603\' cy=\'493\' r=\'5\'/%3E%3Ccircle cx=\'731\' cy=\'737\' r=\'5\'/%3E%3Ccircle cx=\'520\' cy=\'660\' r=\'5\'/%3E%3Ccircle cx=\'309\' cy=\'538\' r=\'5\'/%3E%3Ccircle cx=\'295\' cy=\'764\' r=\'5\'/%3E%3Ccircle cx=\'40\' cy=\'599\' r=\'5\'/%3E%3Ccircle cx=\'102\' cy=\'382\' r=\'5\'/%3E%3Ccircle cx=\'127\' cy=\'80\' r=\'5\'/%3E%3Ccircle cx=\'370\' cy=\'105\' r=\'5\'/%3E%3Ccircle cx=\'578\' cy=\'42\' r=\'5\'/%3E%3Ccircle cx=\'237\' cy=\'261\' r=\'5\'/%3E%3Ccircle cx=\'390\' cy=\'382\' r=\'5\'/%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            opacity: 0.12,
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          borderRadius: 12,
          boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 12,
            padding: '2px',
            background: 'linear-gradient(120deg, #6366F1, #10B981)',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            opacity: 0,
            transition: 'opacity 0.3s ease-in-out',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px 0 rgba(0, 0, 0, 0.3)',
            '&::before': {
              opacity: 1,
            },
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(120deg, #6366F1, #10B981)',
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
          background: 'rgba(15, 23, 42, 0.6)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(99, 102, 241, 0.08)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(105deg, rgba(99, 102, 241, 0.03) 0%, rgba(16, 185, 129, 0.03) 100%)',
            zIndex: -1,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease-in-out',
        },
        elevation1: {
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: 'rgba(15, 23, 42, 0.8)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.3)',
            },
            '& fieldset': {
              borderColor: 'rgba(148, 163, 184, 0.3)',
              transition: 'all 0.2s ease-in-out',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.5)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
          backdropFilter: 'blur(8px)',
          '&.MuiChip-filled': {
            background: 'linear-gradient(120deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))',
            border: '1px solid rgba(99, 102, 241, 0.1)',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #6366F1, #10B981)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            color: '#F9FAFB',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(99, 102, 241, 0.3)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: 8,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          padding: '8px 12px',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 50,
          height: 30,
          padding: 0,
        },
        switchBase: {
          padding: 5,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            '& + .MuiSwitch-track': {
              backgroundColor: 'rgba(16, 185, 129, 0.6)',
              opacity: 1,
              border: 0,
            },
          },
        },
        thumb: {
          width: 20,
          height: 20,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
        },
        track: {
          borderRadius: 30 / 2,
          backgroundColor: 'rgba(148, 163, 184, 0.2)',
          opacity: 1,
        },
      },
    },
  },
}); 