import React from 'react';
import './App.css';
import Routes from "./routes/Routes";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";


export const icucodeTheme = createMuiTheme({
    palette: {
        common: { black: "#000", white: "#fff" },
        background: { paper: "#fff", default: "#fafafa" },
        primary: {
            light: "rgb(255,122,175)",
            main: "#ec3052",
            dark: "#FF860017",
            contrastText: "#fff",
        },
        secondary: {
            light: "#FF373737",
            main: "#222",
            dark: "#000",
            contrastText: "#fff",
        },
        error: {
            light: "#e57373",
            main: "#f44336",
            dark: "#d32f2f",
            contrastText: "#fff",
        },
        text: {
            primary: "rgba(0, 0, 0, 0.87)",
            secondary: "rgba(0, 0, 0, 0.54)",
            disabled: "rgba(0, 0, 0, 0.38)",
            hint: "rgba(0, 0, 0, 0.38)",
        },
    }
});

function App() {


  return (
      <MuiThemeProvider theme={icucodeTheme}>
          <div className="App">
              <Routes/>
          </div>
      </MuiThemeProvider>

  );
}

export default App;
