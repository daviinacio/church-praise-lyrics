import { blue, deepOrange, lightBlue, orange, purple, blueGrey } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: orange[500],
      main: orange[700],
      dark: "#ab5803",
      contrastText: '#fff',
    },
    secondary: {
      light: blueGrey[600],
      main: blueGrey[800],
      dark: blueGrey[900],
      contrastText: '#000',
    },
  },
  direction: 'rtl',
  overrides: {
    'MuiDialogActions': {
      root: {
        padding: '8px 16px',

        '& .MuiButton-label': {
          fontWeight: 600
        }
      }
    }
  }

  // components: {
  //   // Name of the component
  //   MuiBackdrop: {
  //     variants: [
  //       {
  //         props: { variant: 'loading' },
  //         style: {
  //           backgroundColor: 'rgba(250, 250, 250, 0.5)',
  //           zIndex: 1,  
  //           transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important'
  //         }
  //       }
  //     ]
  //   }
  // }

  // overrides: {
  //   MuiBackdrop: {
  //     '@loading': {
  //       backgroundColor: 'rgba(250, 250, 250, 0.5)',
  //       zIndex: 1,
  //       transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important'
  //     }
  //   }
  // }
});

export default theme;