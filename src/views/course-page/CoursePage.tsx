import React, {useEffect, useState} from "react";
import ProfileDrawer from "../../components/profile/ProfileDrawer";
import clsx from "clsx";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Grid, Typography} from "@material-ui/core";
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
    match: any;
}

const CoursePage = (props: Props) => {

    const classes = useStyles();

    const [open, setOpen] = React.useState<boolean>(true);
    const [user, setUser] = useState<any>(null);
    const [course, setCourse] = useState<any>({});

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // Fetch user model and courselist
    useEffect(() =>{
        axios.get("/api/users/get", {
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setUser(res.data)
        }).catch((err) => {
            console.log(err)
        })

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
    },[])

    return (
        <div>
            <ProfileDrawer user={user} open={open} handleOpen={handleDrawerOpen} handleClose={handleDrawerClose}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
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
                    </Grid>
                </Grid>
            </main>
        </div>
    )
};

export default CoursePage;