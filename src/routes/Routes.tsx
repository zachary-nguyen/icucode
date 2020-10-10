import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Login from "../views/login/Login";
import Profile from "../views/profile/Profile";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/profile"} exact component={Profile} />
        <Route path={"/login"} exact component={Login} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
