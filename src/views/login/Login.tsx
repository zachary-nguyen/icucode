import {
  Avatar,
  Button,
  Container,
  createStyles,
  CssBaseline,
  Grid,
  Link,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
const axios = require('axios');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    errors: {
      width: "100%",
    }
  })
);

interface Props {}


const Login = (props: Props) => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [renderedMessage, setRenderedMessage] = useState(false);
  const [authErrors, setAuthErrors] = useState([""]);

  const loginUser= () => {
    setRenderedMessage(true);
    setAuthErrors([""]);

    if(email === "" || password === ""){
      setAuthErrors(["Missing email or password"]);
      return;
    }else if (!validateEmail(email)){
      setAuthErrors(["Invalid email format"]);
      return;
    }

    axios.post('/api/auth/login', {
      email: email,
      password: password,
    })
    .then(function (response: any) {
      if (response.status === 200) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('expiry', response.data.expiry);
        window.location.replace("/profile");
      }else{
        console.log("Something went really wrong");
      }
    })
    .catch(function (error: any) {
      setAuthErrors([error.message]);
      console.log(error);
    });
  };

  /*
  * Message to render when redirected from successful auth
  */
  const successfulRegistrationMessage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if(!username || renderedMessage){
      return(null);
    }

    return(
      <p>Successfully created {username}</p>
    );
  }

  const errorsList = (authlErrors: string[]) => {
    if(!authErrors || authErrors.length < 1){
      return(null);
    }

    const listItems = authErrors.map((error: string) =>
      <p key={error}>{error}</p>
    );

    return (
      <div>{listItems}</div>
    );
  }

  const validateEmail = (email: string) => {
   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
      return (true);
    }
    return(false);
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}></Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Typography className={classes.errors} component="div" variant="body1" align="left">
          {successfulRegistrationMessage()}
        </Typography>
        <Typography className={classes.errors} component="div" variant="body1" color="error" align="left">
          {errorsList(authErrors)}
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            type="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => loginUser()}
          >
            Sign In
          </Button>
          <Grid container
            direction="row"
            justify="center"
            alignItems="center">
            <Grid item>
              <Link href="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Login;
