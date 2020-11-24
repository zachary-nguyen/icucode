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
            // @ts-ignore
            const files = request.files;

            //-------- Create/Edit submission --------
            //@ts-ignore
            let submission = await Submission.findOne({studentId: request.user_id});

            if(!submission) {
                submission = new Submission();
                //@ts-ignore
                submission.studentId = request.user._id;
                submission.submitted = false;
            }

            for(let file of files) {
                try{
                    const newFile = new File();
                    // @ts-ignore
                    const data: any = await fs.readFileSync(path.resolve(__dirname,"..", "backend", "tmp",`${file.filename}`), "utf8", (err,data) => {
                        if (err) {
                            console.log(err)
                            return response.status(400);
                        }
                        return data;
                    });
                    newFile.data = new Binary(Buffer.from(data));
                    // @ts-ignore
                    newFile.meta_data = file;

                    // // @ts-ignore
                    await fs.unlinkSync(path.resolve(__dirname,"..", "backend", "tmp",`${file.filename}`));

                    await newFile.save();

                    submission.files.push(newFile);

                } catch (err) {
                    console.log(err)
                }
            }

            //-------- Add submission to assignment --------
            const assignment : any = await Assignment.findOne({_id: request.body.assignmentId})
                .populate({
                    path: "submissions",
                    model: "Submission"
                })

            if(assignment) {
                if(assignment.submissions.length > 0) {
                    assignment.submissions.map((sub) => {
                        // If student already submitted we update
                        //@ts-ignore
                        if(sub.studentId === request.user_id) {
                            return submission;
                        }
                        return sub;
                    })
                } else {
                    assignment.submissions.push(submission)
                }

            }

            await assignment.save();
            await submission.save();

            return response.status(200).json("Uploaded")
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
            console.log(path.resolve(__dirname,"..", "backend", "tmp",`${request.file.filename}`))
            // @ts-ignore
            const data: any = fs.readFileSync(path.resolve(__dirname,"..", "backend", "tmp",`${request.file.filename}`), "utf8", (err,data) => {
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
            fs.unlinkSync(path.resolve(__dirname,"..", "backend", "tmp",`${request.file.filename}`));

            await file.save();

            //-------- Create/Edit submission --------
            //@ts-ignore
            let submission = await Submission.findOne({studentId: request.user_id});

            // If submission exist we edit
            if(submission) {
                submission.files.push(file);
            } else {
                submission = new Submission();
                // @ts-ignore
                submission.studentId = request.user._id;
                submission.submitted = false;
                submission.files = [file];
            }


            //-------- Add submission to assignment --------
            const assignment : any = await Assignment.findOne({_id: request.body.assignmentId})
                .populate({
                    path: "submissions",
                    model: "Submission"
                })

            if(assignment) {
                if(assignment.submissions.length > 0) {
                    assignment.submissions.map((sub) => {
                        // If student already submitted we update
                        //@ts-ignore
                        if(sub.studentId === request.user_id) {
                            return submission;
                        }
                        return sub;
                    })
                } else {
                    assignment.submissions.push(submission)
                }

            }

            await submission.save();
            await assignment.save();

            return response.status(200).json(file._id)
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
