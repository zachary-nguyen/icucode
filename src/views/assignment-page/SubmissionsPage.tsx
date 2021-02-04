import React, {useEffect, useState} from "react";
import {Grid, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
       flexGrow: {
           flexGrow: 1
       },
        input: {
           opacity: 0,
            zIndex:10
        },
        dropZone: {
           width: "100%",
           height: 100,
            position: "relative",
            borderRadius: 3,
           border: `1px ${theme.palette.primary.main} dotted`,
            marginTop: "2%",
            marginBottom: "2%",
           "&:hover":{
               backgroundColor: "rgba(191,17,43,0.8)",
           },
            "& input": {
               position: "absolute",
               height: "inherit",
                width: "inherit",
                display: "block",
            },
            "& label": {
               display: "block",
                position: "absolute",
                height: "inherit",
                width: "inherit",
                "& p":{
                    "&:hover":{
                        color: "white"
                    },
                }
            },
           "& p":{
               position: "absolute",
               height: "inherit",
               width: "inherit",
               lineHeight: "87px",
               "&:hover":{
                   color: "white"
               },
           }
        },
        button: {
           marginRight: "1%"
        },
        fileList: {
           fontSize: "0.8rem",
            padding: "8px !important"
        },
        actionContainer: {
           marginBottom: "2%"
        },
        listItemSelect: {
           backgroundColor: "rgba(191,17,43,0.5)"
        }
    }),
);


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