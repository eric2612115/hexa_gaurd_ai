// themes/theme.js
import { createTheme } from '@mui/material/styles';

// 自定義深色主題與綠色主調
export const darkGreenTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Spotify綠，鮮明且現代的綠色
      light: '#3ECB71',
      dark: '#178F42',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1ED760', // 稍微亮一點的綠色用於強調
      light: '#4BE383',
      dark: '#13A447',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#121212', // 深灰黑色背景
      paper: '#1E1E1E',    // 略微淺一點的面板背景
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
    divider: '#333333',
    success: {
      main: '#1DB954',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#29B6F6',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
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
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(29, 185, 84, 0.4)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #1DB954 30%, #1ED760 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #121212 0%, #1A1A1A 100%)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #333333',
          background: 'linear-gradient(145deg, #1A1A1A 0%, #222222 100%)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #333333',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#1E1E1E',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: '#1DB954',
            '& + .MuiSwitch-track': {
              backgroundColor: '#178F42',
            },
          },
        },
        track: {
          backgroundColor: '#666666',
        },
      },
    },
  },
});