import React, {createContext, useEffect, useState} from 'react';
import './App.css';
import Routes from "./routes/Routes";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import ProfileDrawer from "./components/profile/ProfileDrawer";
import axios, {AxiosResponse} from "axios";
import {getAuthHeaders, clearSession, isSessionValid} from "./session";
import clsx from "clsx";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import { useLocation } from 'react-router-dom'

const drawerWidth = 240;

export const icucodeTheme = createMuiTheme({
    palette: {
        common: { black: "#000", white: "#fff" },
        background: { paper: "#fff", default: "#fafafa" },
        primary: {
            light: "rgb(255,122,175)",
            main: "#bf112b",
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
    },
    overrides: {
        MuiButton: {
            root: {
                "&:hover":{
                    backgroundColor: "rgba(236,48,82,0.8) !important"
                }
            }
        }

    }
});

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: theme.palette.primary.main
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginTop: 64,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth,
        },
        container: {
            marginTop: "3%"
        },
    }),
);

export const UserContext = createContext(null);

function App() {
    const classes = useStyles();

    const [open, setOpen] = React.useState<boolean>(true);
    const [user, setUser] = useState<any>(null);
    const location = useLocation();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if(!isSessionValid()){
          // TODO:
          // Fix this condition
          console.log("session is not valid");
          clearSession();
          if(window.location.pathname === '/' ||
            window.location.pathname === '/login' ||
            window.location.pathname === '/register'){
              // do nothing here
          }else{
            window.location.replace('/');
          }
          return;
        }

        axios.get("/api/users/get", {
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setUser(res.data)
        }).catch((err) => {
            console.log(err)
            clearSession();
        })
    },[location])

      return (
          <MuiThemeProvider theme={icucodeTheme}>
                  {isSessionValid() ?
                      <UserContext.Provider value={user}>
                          <div className="App">
                              <ProfileDrawer user={user} open={open} handleOpen={handleDrawerOpen} handleClose={handleDrawerClose}/>
                              <main
                                  className={clsx(classes.content, {
                                      [classes.contentShift]: open,
                                  })}
                              >
                                  <Routes/>
                              </main>
                          </div>
                      </UserContext.Provider>
                      :
                      <Routes/>
                  }
          </MuiThemeProvider>

      );
}

export default App;
