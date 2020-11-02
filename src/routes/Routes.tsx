import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Login from "../views/login/Login";
import Register from "../views/login/Register";
import Profile from "../views/profile/Profile";
import CreateCourse from "../views/create-course/CreateCourse";
import CourseList from "../views/courselist/CourseList";
import CourseRegistration from "../views/course-registration/CourseRegistration";
import {isSessionValid} from "../session";
import CoursePage from "../views/course-page/CoursePage";

const Routes = () => {
  if(isSessionValid()) {
    return (
        <BrowserRouter>
          <Switch>
            <Route path={"/"} exact component={Login} />
            <Route path={"/profile"} exact component={Profile} />
            <Route path={"/login"} exact component={Login} />
            <Route path={"/register"} exact component={Register} />
            <Route path={"/create-course"} exact component={CreateCourse}/>
            <Route path={"/courselist"} exact component={CourseList}/>
            <Route path={"/course/register/:courseCode"} exact component={CourseRegistration}/>
            <Route path={"/course/view/:courseCode"} exact component={CoursePage}/>
            <Route error component={Profile}/>
          </Switch>
        </BrowserRouter>
    );
  } else {
    return (
        <BrowserRouter>
          <Switch>
            <Route path={"/"} exact component={Login} />
            <Route path={"/login"} exact component={Login} />
            <Route path={"/register"} exact component={Register} />
            <Route error component={Login}/>
          </Switch>
        </BrowserRouter>
    );
  }

};

export default Routes;
