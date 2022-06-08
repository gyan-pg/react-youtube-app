import './App.css';
import indigo from '@material-ui/core/colors/indigo';
import { createTheme } from '@material-ui/core';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: {
      main: "#f44336",
    },
  },
  typography: {
    fontFamily: "Comic Neue",
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>

    </MuiThemeProvider>
  );
}

export default App;
