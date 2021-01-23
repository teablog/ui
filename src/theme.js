import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#1a73e8',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: 'rgba(0,0,0,0)',
    }
  },
  typography: {
    fontFamily: [
      'Google Sans Display',
      'sans-serif'
    ].join(','),
    h2: {
      fontSize: 20,
      fontWeight: 500,
    },
    h3: {
      fontSize: 18,
      fontWeight: 500,
    },
    h4: {
      fontSize: 16,
      fontWeight: 500,
    },
    h5: {
      fontSize: 14,
      fontWeight: 500, 
    },
    h6: {
      fontSize: 13,
      fontWeight: 500, 
    },
    body2: {
      fontSize: 14,
      fontWeight: 400, 
    },
    caption: {
      opacity: 0.7
    },
    subtitle1: {
      opacity: 0.8,
    },
    button: {
      textTransform: "none",
    }
    // fontSize: 14,
    // fontWeight: 400,
  },
  zIndex: {
    mobileStepper: 1000,
    appBar: 2000,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  dycBorder: '1px solid #dadce0',

});

export default theme;
