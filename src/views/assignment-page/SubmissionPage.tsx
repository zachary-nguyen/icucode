import React, {useEffect, useState} from "react";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";
import ReactAce from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import FileCopyIcon from '@material-ui/icons/FileCopy';

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

const SubmissionPage = (props: Props) => {
    const classes = useStyles();
    const [submission, setSubmission] = useState<any>({});
    const [files,setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(0);
    const [fileContent, setFileContent] = useState([]);
    const [fileOutput, setFileOutput] = useState([]);
    const [grade, setGrade] = useState("");
    const [edit, setEdit] = useState(true);

    const icuCompiler = axios.create({
      baseURL: 'https://icucompiler.herokuapp.com',
      timeout: 10000,
    });

    // Fetch user model and courselist
    useEffect( () =>{
        // fetch courses
        axios.get("/api/assignments/submission", {
            params: {
                submissionId: props.match.params.submissionId
            },
            headers: getAuthHeaders()
        }).then(async (res: AxiosResponse) => {
            setSubmission(res.data);
            setGrade(res.data.grade)
            console.log('data', res.data);
            if(res.data.files.length > 0){
                // populate states
                console.log(res.data)
                setFiles(res.data.files.map((f:any)=> f.meta_data));
                setFileContent(res.data.files.map((f:any) => Buffer.from(f.data).toString("utf8")));
                setFileOutput(res.data.files.map((f:any) => Buffer.from(f.output).toString("utf8")));
            }
        }).catch(err => {
            console.log(err)
        })


    },[props.match.params.submissionId])

    const compile = () => {
        if (submission.files.length > 0) {
          console.log("sending request for submission to be compiled");
          let submissionID = submission._id;
          console.log("sending compilation request for submission: ", submissionID);

          icuCompiler.get(`/compile/${submissionID}`).then(res => {
            console.log("compile res", res);
          });
        }
    }

    const onChange = (e: any)=> {
        setGrade(e.target.value)
    };

    // --- This is the submisson view ----- //
    return (
        <div>
            <Grid container direction={"column"}>
                <Grid justify={"flex-start"} container direction={"column"} item xs={12}>
                    <Typography variant={"h4"}>
                        <strong> Viewing submission for student: {submission.studentId && submission.studentId.firstName + " " + submission.studentId.lastName} </strong>
                    </Typography>
                </Grid>
                <Grid container direction={"column"}>
                        <Grid container direction={"row"}>
                            <Grid className={classes.actionContainer} justify="center" direction={"row"} item alignItems={"center"} container xs={12}>
                                <Grid item xs={2}>
                                    <TextField fullWidth variant={"outlined"} onChange={onChange} disabled={edit} label={"Grade"} value={grade}/>
                                    <Button fullWidth onClick={() => setEdit(!edit)} color={"primary"} variant={"outlined"}>Edit</Button>
                                </Grid>
                                <Grid item xs={2}>
                                    Compiled: { (fileOutput && fileOutput.length > 0) ? "Finished compiling" : "Not Compiled" }
                                </Grid>
                                {/*<div className={classes.flexGrow}/>*/}
                                <Grid item xs={4}>
                                    <TextField variant={"outlined"} fullWidth label={"Feedback"}/>
                                </Grid>
                                <Grid alignContent={"flex-end"} justify={"flex-end"} alignItems={"flex-end"} item container xs={4}>
                                    <Button color={"primary"} variant={"outlined"} onClick={compile}> Compile </Button>
                                </Grid>

                            </Grid>
                        </Grid>
                </Grid>
                <Grid item>
                    {files.length > 0 && (files[selectedFile].name || files[selectedFile].filename)}
                </Grid>
                {fileContent  &&
                    <Grid direction={"row"} item container xs={12}>
                        <Grid item xs={2}>
                            <List className={classes.fileList}>
                                {files.length > 0 && Array.from(files).map((file, index)=> {
                                    return(
                                        <ListItem className={index === selectedFile ? classes.listItemSelect : ""} onClick={() => {setSelectedFile(index)}} key={file.name || file.filename} button>
                                            <ListItemIcon><FileCopyIcon color={"primary"}/> </ListItemIcon>
                                            <ListItemText disableTypography={true} primary={file.filename || file.name } />
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Grid>
                        <Grid xs={10} item>
                            <ReactAce
                                mode={"java"}
                                theme={"github"}
                                width={"100%"}
                                height={"50vh"}
                                readOnly={true}
                                value={fileContent[selectedFile]}
                            />

                            {fileOutput[selectedFile] &&
                              <Typography variant={"h4"}>
                                  <strong> File output </strong>
                              </Typography>
                            }
                            {fileOutput[selectedFile] &&
                              <Grid xs={10} item>
                                  <ReactAce
                                      mode={"java"}
                                      theme={"github"}
                                      width={"100%"}
                                      height={"50vh"}
                                      readOnly={true}
                                      value={fileOutput[selectedFile]}
                                  />
                              </Grid>
                            }
                        </Grid>
                    </Grid>
                }
            </Grid>
        </div>
    )
};

export default SubmissionPage;