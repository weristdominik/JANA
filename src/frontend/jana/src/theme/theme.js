// theme.js
import { createTheme } from '@mui/material/styles';

const appleNotesColors = {
  primary: '#FFCC00',
  secondary: '#484848',
  background: '#F9F9F9',
  sidebar: '#E5E5E5',
  noteBackground: '#FFD52E33',
};

const theme = createTheme({
  palette: {
    primary: { main: appleNotesColors.primary },
    secondary: { main: appleNotesColors.secondary },
    background: {
      default: appleNotesColors.background,
      paper: appleNotesColors.noteBackground,
    },
    sidebar: { main: appleNotesColors.sidebar },
    noteBackground: { main: appleNotesColors.noteBackground },
  },

  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: { fontWeight: 'bold' },
    body2: { color: appleNotesColors.secondary },
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
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF !important",  // PURE WHITE
          color: appleNotesColors.secondary,
          boxShadow:
            "0 4px 12px rgba(0, 0, 0, 0.12)", // optional macOS-like shadow
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'inherit',  // force Links to inherit parent color by default
        },
      },
    },
  },
  custom: {
    roundButton: {
      bgcolor: "#F9F9F9",
      color: appleNotesColors.primary,
      transition: "all 0.25s ease",
      "&:hover": {
        bgcolor: appleNotesColors.primary,
        color: "#fff",
      },
    },
  },
});

export default theme;
