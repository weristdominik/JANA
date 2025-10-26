import { createTheme } from '@mui/material/styles';

const airbnbColors = {
  primary: '#FF5A5F',
  secondary: '#484848',
  background: '#FFFFFF',
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
});

export default theme;
