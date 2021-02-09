import { authorize } from "../config/auth";
import * as express from "express";
import { Request, Response } from "express";
import Controller from "../interfaces/controller.interface";
import Course from "../models/courses";
import Assignment from "../models/assignments";
import Submission from "../models/submission";

export default class AssignmentController implements Controller {
    public path = "/api/assignments";

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/assignmentlist`,authorize, this.getAssignmentList);
        this.router.get(`${this.path}/get`,authorize, this.getAssignment);
        this.router.get(`${this.path}/submission`,authorize, this.getSubmission);
        this.router.post(`${this.path}/create`,authorize, this.createAssignment);
    }

    private getAssignmentList = async (request: Request, response: Response) => {
        try {
            const assignmentList = await Assignment.find();
            return response.status(200).json(assignmentList)
        } catch (error) {
            return response.status(400).json(error);
        }
    };

    private getAssignment = async (request: Request, response: Response) => {
        try {
            // Get assignment for given student
            // @ts-ignore
            let assignment = await Assignment.findOne({_id: request.query.assignmentId})
                .populate({
                    path: "submissions",
                    model: "Submission",
                    // @ts-ignore
                    match: {studentId: request.user._id},
                    populate: {
                        path: "files",
                        model: "File"
                    }
                })

            console.log(assignment);
            // Return submission for students
            // @ts-ignore
            assignment.submissions[0].files = assignment.submissions[0].files.map(f => f.data = f.data.buffer); // return buffer
            return response.status(200).json(assignment)
        } catch (error) {
            console.log(error)
            return response.status(400).json(error);
        }
    };

    private getSubmission = async (request: Request, response: Response) => {
        try {
            // Get assignment for given student
            // @ts-ignore
            let submission = await Submission.findOne({_id: request.query.submissionId})
                .populate({
                    path: "files",
                    model: "File",
                    // @ts-ignore
                })
            // @ts-ignore
            submission.files = submission.files.map(f => f.data = f.data.buffer);
            return response.status(200).json(submission)
        } catch (error) {
            return response.status(400).json(error);
        }
    };

    private createAssignment = async (request: Request, response: Response) => {
        try {
            const assignment = new Assignment();

            const course = await Course.findOne({"courseCode": request.body.courseId});
            // @ts-ignore

            assignment.assignmentName = request.body.assignmentName;

            // @ts-ignore

            assignment.courseId = course._id;

            //add new assignment to course
            course.courseAssignments.push(assignment);

            await assignment.save().catch(err=>console.log(err))
            await course.save().catch(err=>console.log(err))
            return response.status(200).json(assignment);

        } catch (error) {
            return response.status(400).json(error);
        }
    };

}
