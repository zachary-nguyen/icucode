import React, {useEffect, useState} from "react";
import {Button, Grid, Snackbar, Typography} from "@material-ui/core";
import {getAuthHeaders} from "../../session";
import {AxiosResponse} from "axios";
import axios from "axios";
import ReactAce from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
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

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AssignmentPage = (props: Props) => {
    const classes = useStyles();
    const [assignment, setAssignment] = useState<any>({});
    const [files,setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState({
        status: null
    });
    const [selectedFile, setSelectedFile] = useState(0);
    const [fileContent, setFileContent] = useState([]);
    const [fileOutput, setFileOutput] = useState([]);

    // Fetch user model and courselist
    useEffect( () =>{
        // fetch courses
        axios.get("/api/assignments/get", {
            params: {
                assignmentId: props.match.params.assignmentId
            },
            headers: getAuthHeaders()
        }).then(async (res: AxiosResponse) => {
            setAssignment(res.data);

            if(res.data.submissions[0].files.length > 0){
                // populate states
                console.log(res.data)
                setFiles(res.data.submissions[0].files.map((f:any)=> f.meta_data));
                setFileContent(res.data.submissions[0].files.map((f:any) => Buffer.from(f.data).toString("utf8")));
                setFileOutput(res.data.submissions[0].files.map((f:any) => Buffer.from(f.output).toString("utf8")));
            }
        }).catch(err => {
            console.log(err)
        })


    },[props.match.params.assignmentId])

    /**
     * When input field is populated
     * @param e
     */
    const onFileChange = async (e: any) => {
        setFiles(e.target.files)

        const results = await Promise.all(Array.from(e.target.files).map(async (file: any) => {
            const fileContents = await handleFileChosen(file);
            return fileContents;
        }));
        setFileContent(results);
    }

    const handleFileChosen = async (file: any) => {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = reject;
            fileReader.readAsText(file);
        });
    }

    const upload = () => {
        const formData = new FormData();

        Array.from(files).forEach( (file,index) => {
            formData.append(`sourceFile`, file);
        })

        formData.append("assignmentId", props.match.params.assignmentId)
        // Determine multi file or single
        if(files.length > 1) {
            axios.post("/api/upload/multi", formData, {headers: getAuthHeaders()})
                .then((res) => {
                    if(res.status === 200) {
                        if(res.status === 200) {
                            setUploadStatus({status: true})
                            setAssignment(res.data)
                        }
                    }
                })
                .catch(err=> setUploadStatus({status: false}))
        } else if(files.length === 1) {
            axios.post("/api/upload/single", formData, {headers: getAuthHeaders()})
                .then((res) => {
                    if(res.status === 200) {
                        setUploadStatus({status: true})
                        setAssignment(res.data)
                    }
                })
                .catch(err=> setUploadStatus({status: false}))
        } else {
            return;
        }
    }

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setUploadStatus({status: null});
    };

    const assignmentIsCompiled = (assignment: any) =>{
      if(assignment.submissions && assignment.submissions.length > 0){
        if(assignment.submissions[0].compiled){
          return true;
        }
      }
      return false;
    }

    // --- This is the student view ----- //
    return (
        <div>
            <Grid container direction={"column"}>
                <Grid justify={"flex-start"} container direction={"column"} item xs={12}>
                    <Typography variant={"h4"}>
                        {assignment != null && <strong> {assignment.assignmentName} </strong>}
                    </Typography>
                </Grid>
                <Grid container direction={"column"}>
                        <Grid container direction={"row"}>
                            <Grid container item direction={"column"} xs={12}>
                                <form encType={"multipart/form-data"}  method="post" className={classes.dropZone}>
                                    <input className={classes.input} id="files" type={"file"} multiple={true} accept={".java"} onChange={onFileChange} name={"sourceFile"}/>
                                    <label htmlFor={"files"} >
                                        <Typography color={"primary"} align={"center"}><strong>Upload your file(s)</strong></Typography>
                                    </label>
                                </form>
                            </Grid>
                            <Grid className={classes.actionContainer} justify="center" direction={"row"} item container xs={12}>
                                <Grid item xs={2}>
                                    Grade: {assignment.length === 0 ? assignment.grade : "Not Graded"}
                                </Grid>
                                <Grid item xs={2}>
                                    Compiled: { assignmentIsCompiled(assignment) ? "Finished compiling" : "Not Compiled" }
                                </Grid>
                                <div className={classes.flexGrow}/>
                                <Grid alignContent={"flex-end"} justify={"flex-end"} alignItems={"flex-end"} item container xs={4}>
                                    <Button disabled={files && files.length === 0} className={classes.button} color={"primary"} variant={"contained"} onClick={upload}> Upload </Button>
                                    <Button color={"primary"} variant={"outlined"} onClick={upload}> Remove </Button>
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
                        </Grid>
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
                }
                <Snackbar open={uploadStatus.status !== null} autoHideDuration={6000} onClose={handleClose}>
                    {uploadStatus.status === true ?
                        <Alert onClose={handleClose} severity="success">
                            Your Assignment has been uploaded!
                        </Alert>
                        :
                        <Alert onClose={handleClose} severity="error">
                            There was an error uploading your assignment!
                        </Alert>
                    }
                </Snackbar>
            </Grid>
        </div>
    )

    // --- Professor View --- //


};

export default AssignmentPage;