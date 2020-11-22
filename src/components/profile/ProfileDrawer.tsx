import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SchoolIcon from '@material-ui/icons/School';
import ClassIcon from '@material-ui/icons/Class';
import {App} from "../../../codesets";
import AddIcon from '@material-ui/icons/Add';
import {Link} from "react-router-dom";
import {clearSession} from "../../session";
import {Button} from "@material-ui/core";

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
            backgroundColor: "#bf112b"
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
            backgroundColor: theme.palette.secondary.main,
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'flex-end',
            "& svg": {
                color: "white"
            }
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: -drawerWidth,
        },
        contentShift: {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        },
        title: {
            flexGrow: 1,
            textAlign: "left"
        }
    }),
);

interface Props {
    open: boolean;
    handleOpen: any;
    handleClose: any;
    user?: App.UserDoc;
}

const ProfileDrawer = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: props.open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={props.handleOpen}
                        edge="start"
                        className={clsx(classes.menuButton, props.open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={classes.title} variant="h6" noWrap>
                        {props.user && "Logged in as " + props.user.firstName + " " + props.user.lastName}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={() => {
                            clearSession();
                            window.location.replace("/");
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={props.open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={props.handleClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon color={"action"}/> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem component={Link} to={"/profile"}button>
                        <ListItemIcon><SchoolIcon color={"primary"}/> </ListItemIcon>
                        <ListItemText primary={"My courses"} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {props.user && props.user.courses && props.user.courses.length > 0 && props.user.courses.map((course, index) => (
                        <ListItem component={Link} to={"/course/view/" + course.courseCode} button key={course.courseCode}>
                            <ListItemIcon><ClassIcon color={"primary"}/></ListItemIcon>
                            <ListItemText primary={course.courseCode} />
                        </ListItem>
                    ))}
                    {props.user && props.user.facultyUser &&
                        <ListItem color={"primary"} component={Link} to={"/create-course"} button key={"create-course"}>
                            <ListItemIcon><AddIcon color={"primary"}/></ListItemIcon>
                            <ListItemText primary={"Create new course"} />
                        </ListItem>
                    }
                    {props.user && props.user.facultyUser &&
                        <ListItem color={"primary"} component={Link} to={"/courselist"} button key={"register"}>
                            <ListItemIcon><AddIcon color={"primary"}/></ListItemIcon>
                            <ListItemText primary={"Register to Course"} />
                        </ListItem>
                    }
                </List>
            </Drawer>
        </div>
    );
}

export default ProfileDrawer;
