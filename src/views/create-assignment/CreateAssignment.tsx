import React, {useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import axios from "axios";


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

    const [newAssignment, setNewAssignment] = useState<any>({
        assignmentName: "",
        submitted: false, //Pass submitted value
        grade: "",
        courseId: props.match.params.courseCode //Pass course for which assignment is for
    })

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
        </div>
    )
};

export default CreateAssignment;