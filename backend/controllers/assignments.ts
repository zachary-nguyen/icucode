import { authorize } from "../config/auth";
import * as express from "express";
import { Request, Response } from "express";
import Controller from "../interfaces/controller.interface";
import Course from "../models/courses";
import Assignment from "../models/assignments";

export default class AssignmentController implements Controller {
    public path = "/api/assignments";

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/assignmentlist`,authorize, this.getAssignmentList);
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

    private createAssignment = async (request: Request, response: Response) => {
        try {
            const assignment = new Assignment();

            const course = await Course.findOne({"courseCode": request.body.courseId});
            // @ts-ignore

            assignment.assignmentName = request.body.assignmentName;
            assignment.submitted = false;
            assignment.grade = "";
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
