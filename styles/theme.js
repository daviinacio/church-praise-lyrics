import { blue, deepOrange, lightBlue, orange, purple, blueGrey } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: orange[500],
      main: orange[700],
      dark: deepOrange[800],
      contrastText: '#fff',
    },
    secondary: {
      light: blueGrey[600],
      main: blueGrey[800],
      dark: blueGrey[900],
      contrastText: '#000',
    },
  },
  direction: 'rtl'
});

export default theme;