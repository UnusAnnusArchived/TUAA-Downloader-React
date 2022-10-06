import { darkScrollbar } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      dark: '#ffffff',
      light: '#ffffff',
    },
    secondary: {
      main: '#3f3f3f',
    },
    // background: {
    //   default: "#121212",
    //   paper: "#3e3e3e",
    // },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar(),
      },
    },
  },
});

export default theme;
