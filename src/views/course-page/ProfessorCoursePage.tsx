import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Grid, IconButton, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";
import {Button, ListItem, ListItemText} from "@material-ui/core";
import {Link} from "react-router-dom";
import {App} from "../../../codesets";
import {UserContext} from "../../App";
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom'


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        container: {
            marginTop: "3%"
        },
    }),
);

interface Props {
    match: any;
    user?: App.UserDoc;
}

const ProfessorCoursePage = (props: Props) => {

    const classes = useStyles();
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
                                <ListItem component={Link} button to={`/submissions/view/${course.courseCode}/${assignment._id}`} key={assignment._id}>
                                    <ListItemText primary={assignment.assignmentName}/>
                                </ListItem>
                            )
                        })}
                    </Grid>
                    <Grid className={classes.container} container item>
                        <Grid item>
                            <Button href={"/assignment/new/" + course.courseCode} color={"primary"} variant={"contained"}> Create Assignment </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
};

export default ProfessorCoursePage;