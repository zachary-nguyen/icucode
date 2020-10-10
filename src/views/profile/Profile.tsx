import React from "react";
import ProfileDrawer from "../../components/profile/ProfileDrawer";
import clsx from "clsx";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Card, CardActionArea, Grid, Typography} from "@material-ui/core";
import List from "@material-ui/core/List";

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
        courseCard: {
            height: 150,
            width: 150,
            margin: "0 auto"
        },
        cardActionArea: {
            height: "100%",
            width: "100%",
            fontWeight: 800,
            "&:hover":{
                border: `1px solid ${theme.palette.primary.main}`

            }
        },
        assigmentContainer: {
            marginTop: "3%"
        }
    }),
);

interface Props {

}

const Profile = (props: Props) => {

    const classes = useStyles();

    const [open, setOpen] = React.useState<boolean>(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ProfileDrawer open={open} handleOpen={handleDrawerOpen} handleClose={handleDrawerClose}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <Grid container direction={"column"}>
                    <Grid container item xs={3}>
                        <Typography variant={"h3"}>
                            SYSC 4906
                        </Typography>
                    </Grid>
                    <Grid className={classes.assigmentContainer} container direction={"column"} justify={'flex-start'}>
                        <Grid container>
                            <Typography gutterBottom variant={"h5"}>
                                Labs
                            </Typography>
                        </Grid>
                        <Grid container direction={"row"} >
                            {['Assignment 1', 'Assignment 2', 'Assignment 3', "Assignment 4", "Assignment 5", "Assignment 6", "Assignment 7"].map((text, index) => (
                                <Grid item xs alignContent={"center"} alignItems={"center"} justify={"center"}>
                                    <Card key={index} className={classes.courseCard}>
                                        <CardActionArea className={classes.cardActionArea}>
                                            {text}
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid className={classes.assigmentContainer} container direction={"column"} justify={'flex-start'}>
                        <Grid container>
                            <Typography variant={"h5"} gutterBottom>
                                Assignments
                            </Typography>
                        </Grid>
                        <Grid container direction={"row"}>
                            {['Lab 1', 'Lab 2', 'Lab 3', "Lab 4", "Lab 5"].map((text, index) => (
                                <Grid item xs alignContent={"center"} alignItems={"center"} justify={"center"}>
                                    <Card key={index} className={classes.courseCard}>
                                        <CardActionArea className={classes.cardActionArea}>
                                            {text}
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                    </Grid>
                </Grid>

            </main>
        </div>
    )
};

export default Profile;