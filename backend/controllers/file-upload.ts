import { authorize } from "../config/auth";
import * as express from "express";
import { Request, Response } from "express";
import Controller from "../interfaces/controller.interface";
import {upload_multi, upload_single} from "../middleware/upload";
import * as mongo from "mongodb"
import File from "../models/file";
import * as fs from "fs";
import Submission from "../models/submission"
import Assignment from "../models/assignments"
import * as path from "path"

const Binary = mongo.Binary;

export default class FileUploadController implements Controller {
    public path = "/api/upload";

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post( `${this.path}/single`, authorize, upload_single, this.uploadFile);
        this.router.post( `${this.path}/multi`, authorize,  upload_multi, this.uploadMultiFile);
        this.router.get(`${this.path}/fetch`, authorize,  this.getFile)
    }


    /**
     * Upload a multiple file and add it to the assignment submission
     * @param request
     * @param response
     */
    private uploadMultiFile = async (request: Request, response: Response) => {
        try {
            // ----- GET ALL MODELS ------

            // @ts-ignore
            const files = request.files;

            const assignment : any = await Assignment.findOne({_id: request.body.assignmentId})
                .populate({
                    path: "submissions",
                    model: "Submission",
                    populate: {
                        path: "files",
                        model: "File"
                    }
                })

            //-------- Verify if student has made a submission --------
            //@ts-ignore
            let submission = assignment.submissions.filter(s => s.studentId !== request.user._id)[0];
            if(!submission) {
                submission = new Submission();
                //@ts-ignore
                submission.studentId = request.user._id;
                submission.submitted = false;
                submission.compiled = false;
            }

            // Reset submission files
            submission.files = [];

            // ---- Populate submision model with Files
            for(let file of files) {
                try{
                    const newFile = new File();
                    // @ts-ignore
                    const data: any = await fs.readFileSync(process.env.NODE_ENV !== "development" ? path.resolve(__dirname, "..", "tmp", `${file.filename}`) : path.resolve(__dirname, "..", "backend", "tmp", `${file.filename}`), "utf8", (err,data) => {
                        if (err) {
                            console.log(err)
                            return response.status(400);
                        }
                        return data;
                    });
                    newFile.data = new Binary(Buffer.from(data));
                    // @ts-ignore
                    newFile.meta_data = file;

                    await fs.unlinkSync(process.env.NODE_ENV !== "development" ? path.resolve(__dirname, "..", "tmp",`${file.filename}`) : path.resolve(__dirname, "..", "backend", "tmp", `${file.filename}`));

                    await newFile.save();

                    // @ts-ignore
                    submission.files.push(newFile);

                } catch (err) {
                    console.log(err)
                }
            }

            //-------- Add submission to assignment --------
            if(assignment) {
                assignment.submissions = submission;
            }

            if(submission) {
                await submission.save();
            }
            const updatedAssignment : any = await Assignment.findOne({_id: request.body.assignmentId})
                .populate({
                    path: "submissions",
                    model: "Submission",
                    populate: {
                        path: "files",
                        model: "File"
                    }
                })

            return response.status(200).json(updatedAssignment)

        } catch (error) {
            console.log(error)
            return response.status(400).json(error);
        }
    };

    /**
     * Upload a single file and add it to the assignment submission
     * @param request
     * @param response
     */
    private uploadFile = async (request: Request, response: Response) => {
        try {
            const file = new File();
            // @ts-ignore
            const data: any = fs.readFileSync(process.env.NODE_ENV !== "development" ? path.resolve(__dirname, "..", "tmp", `${request.file.filename}`) : path.resolve(__dirname, "..", "backend", "tmp", `${request.file.filename}`), "utf8", (err,data) => {
                if (err) {
                    console.log(err)
                    return response.status(400);
                }
                return data;
            });

            file.data = new Binary(Buffer.from(data));

            // @ts-ignore
            file.meta_data = request.file;

            // Remove tmp file
            // @ts-ignore
            fs.unlinkSync(process.env.NODE_ENV !== "development" ? path.resolve(__dirname, "..", "tmp", `${request.file.filename}`) : path.resolve(__dirname, "..", "backend", "tmp", `${request.file.filename}`));

            await file.save();

            //-------- Add submission to assignment --------
            const assignment : any = await Assignment.findOne({_id: request.body.assignmentId})
                .populate({
                    path: "submissions",
                    model: "Submission",
                    populate: {
                        path: "files",
                        model: "File"
                    }
                })


            //@ts-ignore
            let submission = assignment.submissions.filter(submission => submission.studentId !== request.user_id)[0];

            // If submission exist we edit
            if(submission) {
                submission.files = [file];
            } else {
                submission = new Submission();
                // @ts-ignore
                submission.studentId = request.user._id;
                submission.submitted = false;
                submission.files = [file];
            }

            if(assignment) {
                let newSubmission = [];
                if(assignment.submissions.length > 0) {
                    newSubmission = assignment.submissions.map((sub) => {
                            // If student already submitted we update
                            //@ts-ignore
                            if(sub.studentId === request.user_id) {
                                return submission;
                            }
                            return sub;
                        })
                    assignment.submissions = newSubmission;
                } else {
                    assignment.submissions.push(submission)
                }

            }

            await submission.save();
            await assignment.save();

            const updatedAssignment : any = await Assignment.findOne({_id: request.body.assignmentId})
                .populate({
                    path: "submissions",
                    model: "Submission",
                    populate: {
                        path: "files",
                        model: "File"
                    }
                })

            return response.status(200).json(updatedAssignment)
        } catch (error) {
            console.log(error)
            return response.status(400).json(error);
        }
    };

    private getFile = async (request: Request, response: Response) => {
        try {
            // @ts-ignore
            const file = await File.findOne({_id: request.query.fileId});
            return response.status(200).json(file.data.buffer)
        } catch (error) {
            console.log(error)
            return response.status(400).json(error);
        }
    };
}
