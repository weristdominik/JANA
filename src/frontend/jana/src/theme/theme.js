// theme.js
import { createTheme } from '@mui/material/styles';

const appleNotesColors = {
  primary: '#FFD52E',       // Sunglow
  secondary: '#484848',     // Deep gray text (same as before)
  background: '#F9F9F9',    // Ghost White
  sidebar: '#E5E5E5',       // Platinum
  noteBackground: '#FFD52E33' // Sunglow with light opacity for note background
};

const theme = createTheme({
  palette: {
    primary: {
      main: appleNotesColors.primary,
    },
    secondary: {
      main: appleNotesColors.secondary,
    },
    background: {
      default: appleNotesColors.background,
      paper: appleNotesColors.noteBackground,
    },
    sidebar: {
      main: appleNotesColors.sidebar,
    },
    noteBackground: {
      main: appleNotesColors.noteBackground,
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 'bold',
    },
    body2: {
      color: appleNotesColors.secondary,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: appleNotesColors.primary,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: appleNotesColors.sidebar,
        },
      },
    },
  },
  custom: {
    roundButton: {
      bgcolor: "#F9F9F9",          // Ghost White background for button
      color: appleNotesColors.primary, // Sunglow text
      transition: "all 0.25s ease",
      "&:hover": {
        bgcolor: appleNotesColors.primary, // Sunglow bg on hover
        color: "#fff",                      // white text on hover
      },
    },
  },
});

export default theme;
