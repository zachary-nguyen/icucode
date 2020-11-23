import React, {useEffect, useState} from "react";
import {Grid, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ClassIcon from "@material-ui/icons/Class";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {Link} from "react-router-dom";
import {App} from "../../../codesets";

interface Props {

}

const CourseList = (props: Props) => {

    const [courseList, setCourseList] = useState<any>(null);

    // Fetch user model and courselist
    useEffect(() =>{
        // fetch courses
        axios.get("/api/courses/courselist", {
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setCourseList(res.data);
        }).catch(err => {
            console.log(err)
        })
    },[])


    return (
        <div>
            <Grid container direction={"column"}>
                <Grid container item xs={4}>
                    <Typography variant={"h3"}>
                        Register to a Course
                    </Typography>
                    <Typography variant={"body2"}>
                        Select one of the course below to register
                    </Typography>
                </Grid>
                <Grid container direction={"column"} item>
                    {courseList !== null && courseList.length > 0 && courseList.map((course: App.Course,index: number) => {
                        return (
                            <ListItem component={Link} to={`/course/register/${course.courseCode}`} button key={index}>
                                <ListItemIcon><ClassIcon color={"primary"}/></ListItemIcon>
                                <ListItemText primary={course.courseCode + " - " + course.courseName} secondary={course.description}/>
                            </ListItem>
                        )
                    })}
                </Grid>
            </Grid>
        </div>
    )
};

export default CourseList;