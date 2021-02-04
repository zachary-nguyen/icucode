import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../views/login/Login";
import Register from "../views/login/Register";
import Profile from "../views/profile/Profile";
import CreateCourse from "../views/create-course/CreateCourse";
import CourseList from "../views/courselist/CourseList";
import CourseRegistration from "../views/course-registration/CourseRegistration";
import {isSessionValid} from "../session";
import CoursePage from "../views/course-page/CoursePage";
import CreateAssignment from "../views/create-assignment/CreateAssignment";
import AssignmentPage from "../views/assignment-page/AssignmentPage";
import SubmisionsPage from "../views/assignment-page/SubmissionsPage";
import SubmisionPage from "../views/assignment-page/SubmissionPage";

const Routes = () => {
  if(isSessionValid()) {
    return (
          <Switch>
            <Route path={"/"} exact component={Profile} />
            <Route path={"/profile"} exact component={Profile} />
            <Route path={"/login"} exact component={Profile} />
            <Route path={"/register"} exact component={Profile} />
            <Route path={"/create-course"} exact component={CreateCourse}/>
            <Route path={"/courselist"} exact component={CourseList}/>
            <Route path={"/course/register/:courseCode"} exact component={CourseRegistration}/>
            <Route path={"/course/view/:courseCode"} exact component={CoursePage}/>
            <Route path={"/assignment/new/:courseCode"} exact component={CreateAssignment}/>
            <Route path={"/assignment/view/:courseCode/:assignmentId"} exact component={AssignmentPage}/>
            <Route path={"/submissions/view/:courseCode/:assignmentId"} exact component={SubmisionsPage}/>
            <Route path={"/submission/view/:submissionId"} exact component={SubmisionPage}/>
            <Route error component={Profile}/>
          </Switch>
    );
  } else {
    return (
          <Switch>
            <Route path={"/"} exact component={Login} />
            <Route path={"/login"} exact component={Login} />
            <Route path={"/register"} exact component={Register} />
            <Route error component={Login}/>
          </Switch>
    );
  }

};

export default Routes;
