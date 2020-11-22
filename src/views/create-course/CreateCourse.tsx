import React, {useEffect, useState} from "react";
import ProfileDrawer from "../../components/profile/ProfileDrawer";
import clsx from "clsx";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            backgroundColor: theme.palette.primary.main
        },
        appBarShift: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginTop: 64,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: drawerWidth,
        },
        container: {
            marginTop: "3%"
        },
    }),
);

interface Props {

}

const CreateCourse = (props: Props) => {

    const classes = useStyles();

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
            .then(() => {console.log("created")})
            .catch((err) => {console.log(err)})
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
                        <Button onClick={createCourse} color={"primary"} variant={"contained"}> Create Course </Button>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
};

export default CreateCourse;