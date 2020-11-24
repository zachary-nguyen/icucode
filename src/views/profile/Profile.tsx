import React from "react";
import {Grid, Typography} from "@material-ui/core";
import {App} from "../../../codesets";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ClassIcon from "@material-ui/icons/Class";
import ListItemText from "@material-ui/core/ListItemText";
import { UserContext } from "../../App";

interface Props {

}

const Profile = (props: Props) => {

    return (
        <UserContext.Consumer>
            {user => (
                <div>
                    <Grid container direction={"column"}>
                        <Grid container item xs={4}>
                            <Typography variant={"h3"}>
                                My Courses
                            </Typography>
                        </Grid>
                        <Grid container direction={"column"} item>
                            {user && user.courses.length > 0 && user.courses.map((course: App.Course,index: number) => {
                                return (
                                    <ListItem component={Link} to={`/course/view/${course.courseCode}`} button key={index}>
                                        <ListItemIcon><ClassIcon color={"primary"}/></ListItemIcon>
                                        <ListItemText primary={course.courseCode + " - " + course.courseName} secondary={course.description}/>
                                    </ListItem>
                                )
                            })}
                        </Grid>
                    </Grid>
                </div>
            )}
        </UserContext.Consumer>
    )
};

export default Profile;