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

const Register = (props: Props) => {
  const classes = useStyles();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enrollErrors, setEnrollErrors] = useState([""]);

  /*
  * Validates sign up form
  * @returns ["string"] list of errors with the form
  */
  const validateForm = () => {
    let formErrors = [];

    if(firstName === ""){
      formErrors.push("Invalid first name");
    }

    if(lastName === ""){
      formErrors.push("Invalid last name");
    }

    if(email === "" ||
       !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))){
      formErrors.push("Invalid email");
    }

    if(password === "" || password.length < 8){
      formErrors.push("Password must be at least 8 characters long");
    }

    return formErrors;
  }

  const registerUser = () => {
    setEnrollErrors([""]);
    let formValidationErrors = validateForm();

    if(formValidationErrors.length > 0){
      setEnrollErrors(formValidationErrors);
      return;
    }

    axios.post('/api/auth/register', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    })
    .then(function (response: any) {
      if (response.status === 200) {
        window.location.replace(`/login?username=${email}`);
      }else{
        setEnrollErrors(["something went wrong :/"]);
      }
    })
    .catch(function (error: any) {
      console.log(error);
      setEnrollErrors([error.message]);
    });
  };

  const errorsList = (enrollErrors: string[]) => {
    if(!enrollErrors || enrollErrors.length < 1){
      return(null);
    }

    const listItems = enrollErrors.map((error: string) =>
      <p key={error}>{error}</p>
    );

    return (
      <div>{listItems}</div>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}></Avatar>
        <Typography component="h1" variant="h5">
          Create An Account
        </Typography>
        <Typography className={classes.errors} component="div" variant="body1" color="error" align="left">
          {errorsList(enrollErrors)}
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
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
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e) => registerUser()}
          >
            Sign Up
          </Button>
          <Grid container justify="center">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Register;
