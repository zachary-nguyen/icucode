import React, {useEffect, useState} from "react";
import {Grid, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";
interface Props {
    match: any;
}

const SubmissionsPage = (props: Props) => {
    const [assignment, setAssignment] = useState<any>({});
    const [submissions, setSubmissions] = useState<any>({});

    useEffect( () =>{
        // fetch course & submissions
        axios.get("/api/assignments/get", {
            params: {
                assignmentId: props.match.params.assignmentId
            },
            headers: getAuthHeaders()
        }).then(async (res: AxiosResponse) => {
            setAssignment(res.data);
            setSubmissions(res.data.submissions)
            console.log(res.data);
        }).catch(err => {
            console.log(err)
        })
    },[props.match.params.assignmentId])

    // --- This is the submissions view ----- //
    return (
        <div>
            <Grid container direction={"column"}>
                <Grid justify={"flex-start"} container direction={"column"} item xs={12}>
                    <Typography variant={"h4"}>
                        {assignment != null && <strong> {assignment.assignmentName} Submissions </strong>}
                    </Typography>
                </Grid>
                <Grid container>
                    <Grid container direction={"column"} item>
                        { submissions && submissions.length > 0 && submissions.map((submission: any, index: number) => {
                            return (
                              // @ts-ignore
                              <ListItem component={Link} button to={`/submission/view/${submission._id}`} key={submission._id}>
                                <ListItemText primary={"student id: " + submission.studentId + " compiled: " + (submission.files[0].output ? "Finished compiling" : "Queued for compilation")} />
                              </ListItem>
                            )
                        })}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
};

export default SubmissionsPage;