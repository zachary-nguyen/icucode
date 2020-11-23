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

const AssignmentPage = (props: Props) => {

    const classes = useStyles();

    const [assignment, setAssignment] = useState<any>({});


    // Fetch user model and courselist
    useEffect(() =>{
        // fetch courses
        axios.get("/api/assignments/get", {
            params: {
                assignmentId: props.match.params.assignmentId
            },
            headers: getAuthHeaders()
        }).then((res: AxiosResponse) => {
            setAssignment(res.data);
        }).catch(err => {
            console.log(err)
        })

        
    },[props.match.params.assignmentId])
    
console.log("Arrived at assignment page")
console.log(assignment)
console.log("Props: " + props.match.params.assignmentId)


    return (
        <div>
            <Grid container direction={"column"}>
                <Grid justify={"flex-start"} container direction={"column"} item xs={12}>
                    <Typography variant={"body2"}>
                        <strong> Assignment: </strong>
                        {assignment.assignmentname}
                    </Typography>
                </Grid>
                <Grid container>
                    <Typography variant={"h5"}>
                        Upload Assignment:
                    </Typography>
                    <Typography variant={"h5"}>
                        {/* Add Assignment Here */}
                        <input
                            type="file"
                        />
                    </Typography>                   
                </Grid>
            </Grid>
        </div>
    )
};

export default AssignmentPage;