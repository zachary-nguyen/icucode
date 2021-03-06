import React, {useEffect, useState} from "react";
import {Grid, IconButton, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";
import {ListItem, ListItemText} from "@material-ui/core";
import {Link} from "react-router-dom";
import {App} from "../../../codesets";
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom'

interface Props {
    match: any;
    user?: App.UserDoc;
}

const StudentCoursePage = (props: Props) => {
    const history = useHistory();
    const [course, setCourse] = useState<any>({});

    // Fetch user model and courselist
    useEffect(() =>{
        // fetch courses
        axios.get("/api/courses/get", {
            params: {
                courseCode: props.match.params.courseCode
            },
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setCourse(res.data);
        }).catch(err => {
            console.log(err)
        })
    },[props.match.params.courseCode])

    const deleteCourse = () => {
        axios.delete("/api/courses/delete", {
            params: {
                courseCode: props.match.params.courseCode,
            },
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            console.log("SUCCESS")
            history.push("/profile")
        }).catch(err => {
            console.log(err)
        })
    };


    return (
        <div>
            <Grid container direction={"column"}>
                <Grid justify={"flex-end"} container>
                    <IconButton
                        color="primary"
                        onClick={deleteCourse}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Grid>
                <Grid justify={"flex-start"} container direction={"column"} item xs={12}>
                    <Typography variant={"h3"}>
                        {course && course.courseCode}
                    </Typography>
                    <Typography variant={"body2"}>
                        <strong> Description </strong>
                        {course && course.courseName}
                    </Typography>
                    <Typography variant={"body2"}>
                        <strong>Professor:</strong> {course && course.professor && course.professor.firstName + " " + course.professor.lastName}
                    </Typography>
                </Grid>
                <Grid container>
                    <Typography variant={"h5"}>
                        Assignments
                    </Typography>
                    {/* Add Assignment List Here to be viewed in course page */}
                    <Grid container direction={"column"} item>
                        {course.courseAssignments !== null && course.courseAssignments !== undefined && course.courseAssignments.length > 0 && course.courseAssignments.map((assignment: App.Assignment,index: number) => {
                            return (
                                // @ts-ignore
                                <ListItem component={Link} button to={`/assignment/view/${course.courseCode}/${assignment._id}`} key={assignment._id}>
                                    <ListItemText primary={assignment.assignmentName}/>
                                </ListItem>
                            )
                        })}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
};

export default StudentCoursePage;