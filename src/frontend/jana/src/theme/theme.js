// theme.js
import { createTheme } from '@mui/material/styles';

const airbnbColors = {
  primary: '#FF5A5F',      // Airbnb coral
  secondary: '#484848',    // Deep gray text
  background: '#FFFFFF',   // App background
  sidebar: '#f5f5f7',      // Sidebar background
  noteBackground: '#f7f7f7' // Notes/editor background
};

const theme = createTheme({
  palette: {
    primary: {
      main: airbnbColors.primary,
    },
    secondary: {
      main: airbnbColors.secondary,
    },
    background: {
      default: airbnbColors.background,
      paper: airbnbColors.noteBackground,
    },
    sidebar: {
      main: airbnbColors.sidebar,
    },
    noteBackground: {
      main: airbnbColors.noteBackground,
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 'bold',
    },
    body2: {
      color: airbnbColors.secondary,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: airbnbColors.primary,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: airbnbColors.sidebar,
        },
      },
    },
  },
});

export default theme;
