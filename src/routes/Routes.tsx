import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Login from "../views/login/Login";
import Register from "../views/login/Register";
import Profile from "../views/profile/Profile";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/"} exact component={Login} />
        <Route path={"/profile"} exact component={Profile} />
        <Route path={"/login"} exact component={Login} />
        <Route path={"/register"} exact component={Register} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
