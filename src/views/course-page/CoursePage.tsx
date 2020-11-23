import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Grid, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";
import {Button, ListItem, ListItemText} from "@material-ui/core";
import {Link} from "react-router-dom";
import {App} from "../../../codesets";


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
}

const CoursePage = (props: Props) => {

    const classes = useStyles();

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

    console.log(course.courseAssignments)

    return (
        <div>
            <Grid container direction={"column"}>
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
                                <ListItem component={Link} to={`/assignment/view/${course.courseCode}/${assignment._id}`}>
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

export default CoursePage;