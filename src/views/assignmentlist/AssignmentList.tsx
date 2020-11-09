import React, {useEffect, useState} from "react";
import ProfileDrawer from "../../components/profile/ProfileDrawer";
import clsx from "clsx";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
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

const CourseList = (props: Props) => {

    const classes = useStyles();

    const [open, setOpen] = React.useState<boolean>(true);
    const [user, setUser] = useState<any>(null);
    const [assignmentList, setAssignmentList] = useState<any>(null);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // Fetch user model and assignmentlist
    useEffect(() =>{
        axios.get("/api/users/get", {
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setUser(res.data)
        }).catch((err) => {
            console.log(err)
        })

        // fetch courses
        axios.get("/api/assignments/assignmentlist", {
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setAssignmentList(res.data);
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
                    <Grid container item xs={4}>
                        <Typography variant={"h3"}>
                            Register to a Course
                        </Typography>
                        <Typography variant={"body2"}>
                            Select one of the course below to register
                        </Typography>
                    </Grid>
                    <Grid container direction={"column"} item>
                        {assignmentList !== null && assignmentList.length > 0 && assignmentList.map((assignment: App.Assignment,index: number) => {
                            return (
                                 <ListItem component={Link} to={`/assignment/new`} button key={index}>
                                     <ListItemIcon><ClassIcon color={"primary"}/></ListItemIcon>
                                     <ListItemText primary={assignment.courseId + " - " + assignment.assignmentName} secondary={assignment.submitted}/>
                                 </ListItem>
                            )
                        })}
                    </Grid>
                </Grid>
            </main>
        </div>
    )
};

export default CourseList;