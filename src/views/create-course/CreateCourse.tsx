import React, {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import axios from "axios";
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

}

const CreateCourse = (props: Props) => {

    const history = useHistory();

    const classes = useStyles();

    const [creationStatus, setCreationStatus] = useState({
        error: "",
        success: undefined
    });

    const [newCourse, setNewCourse] = useState<any>({
        courseCode: "",
        courseName: "",
        description: ""
    })

    const courseCodeOnChange = (e: any) => {
        setNewCourse({...newCourse, courseCode: e.target.value});
    }

    const courseNameOnChange = (e: any) => {
        setNewCourse({...newCourse, courseName: e.target.value});
    }

    const descriptionOnChange = (e: any) => {
        setNewCourse({...newCourse, description: e.target.value});
    }

    const createCourse = () => {
        axios.post("/api/courses/create",{
            courseCode: newCourse.courseCode,
            courseName: newCourse.courseName,
            description: newCourse.description
        }, {headers: getAuthHeaders()})
            .then(() => {
                setCreationStatus({
                    success: true,
                    error: ""
                })
                history.push("/profile")
            })
            .catch((err) => {
                setCreationStatus({
                    success: false,
                    error: "Invalid Course Code"
                })
            })
    }

    return (
        <div>
            <Grid container direction={"column"}>
                <Grid container item xs={4}>
                    <Typography variant={"h3"}>
                        New Course Creation
                    </Typography>
                    <Typography variant={"body2"}>
                        Register a new course to be made available to students
                    </Typography>
                </Grid>
                <Grid className={classes.container} container item>
                    <Grid item>
                        <TextField variant={"outlined"}
                                   label={"Course Name"}
                                   required
                                   onChange={courseNameOnChange}
                                   value={newCourse.courseName}
                        />
                    </Grid>
                </Grid>
                <Grid className={classes.container} container item>
                    <Grid item>
                        <TextField variant={"outlined"}
                                   label={"Course Code"}
                                   required
                                   onChange={courseCodeOnChange}
                                   value={newCourse.courseCode}
                                   error={creationStatus.success}
                                   helperText={creationStatus.error}
                        />
                    </Grid>
                </Grid>
                <Grid className={classes.container} container item>
                    <Grid item>
                        <TextField variant={"outlined"}
                                   fullWidth
                                   label={"Course Description"}
                                   onChange={descriptionOnChange}
                                   value={newCourse.description}
                        />
                    </Grid>
                </Grid>
                <Grid className={classes.container} container item>
                    <Grid item>
                        <Button disabled={newCourse.courseCode === "" || newCourse.courseName === ""} onClick={createCourse} color={"primary"} variant={"contained"}> Create Course </Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
};

export default CreateCourse;