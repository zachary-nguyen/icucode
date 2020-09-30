import React from "react";
import {Switch, Route, BrowserRouter} from "react-router-dom";
import Profile from "../views/profile/Profile";

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={"/profile"} exact component={Profile}/>
            </Switch>
        </BrowserRouter>
    )

};

export default Routes;