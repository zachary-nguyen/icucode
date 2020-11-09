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
    match:any;
}

const CreateAssignment = (props: Props) => {

    const classes = useStyles();

    const [open, setOpen] = React.useState<boolean>(true);
    const [user, setUser] = useState<any>(null);
    const [newAssignment, setNewAssignment] = useState<any>({
        assignmentName: "",
        submitted: false, //Pass submitted value
        grade: "",
        courseId: props.match.params.courseCode //Pass course for which assignment is for
    })

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // Fetch user model on page load
    useEffect(() =>{
        axios.get("/api/users/get", {
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setUser(res.data)
        }).catch((err) => {
            console.log(err)
        })
    },[])

    const assignmentNameOnChange = (e: any) => {
        setNewAssignment({...newAssignment, assignmentName: e.target.value});
    }

    // const submittedOnChange = (e: any) => {
    //     setNewAssignment({...newAssignment, submitted: e.target.value});
    // }

    // const gradeOnChange = (e: any) => {
    //     setNewAssignment({...newAssignment, grade: e.target.value});
    // }

    const courseIdOnChange = (e: any) => {
        setNewAssignment({...newAssignment, courseId: e.target.value});
    }

    const createAssignment = () => {
        axios.post("/api/assignments/create",{
            assignmentName: newAssignment.assignmentName,
            submitted: newAssignment.submitted,
            grade: newAssignment.grade,
            courseId: newAssignment.courseId
        }, {headers: getAuthHeaders()})
            .then(() => {console.log("created")})
            .catch((err) => {console.log(err)})
    }

    return (
        <div>
            <ProfileDrawer user={user} open={open} handleOpen={handleDrawerOpen} handleClose={handleDrawerClose}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <Grid container direction={"column"}>
                    <Grid container item xs={4}>
                        <Typography variant={"h3"}>
                            New Assignment Creation
                        </Typography>
                        <Typography variant={"body2"}>
                            Register a new assignment to be made available to students
                        </Typography>
                    </Grid>
                    <Grid className={classes.container} container item>
                        <Grid item>
                            <TextField variant={"outlined"}
                                       label={"Assignment Name"}
                                       required
                                       onChange={assignmentNameOnChange}
                                       value={newAssignment.assignmentName}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.container} container item>
                        <Grid item>
                            <TextField variant={"outlined"}
                                       label={"Assignment Course Code"}
                                       required
                                       onChange={courseIdOnChange}
                                       value={newAssignment.courseId}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.container} container item>
                        <Grid item>
                            <Button onClick={createAssignment} color={"primary"} variant={"contained"}> Create Assignment </Button>
                            <Button href="/profile" color={"primary"} variant={"contained"}> Back To Profile </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </main>
        </div>
    )
};

export default CreateAssignment;