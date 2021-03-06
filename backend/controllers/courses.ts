import { authorize } from "../config/auth";
import * as express from "express";
import { Request, Response } from "express";
import User from "../models/user";
import Controller from "../interfaces/controller.interface";
import Course from "../models/courses";

export default class CourseController implements Controller {
    public path = "/api/courses";

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/get`,authorize, this.getCourse);
        this.router.get(`${this.path}/courselist`,authorize, this.getCourseList);
        this.router.get(`${this.path}/search`,authorize, this.searchCourseList)
        this.router.post(`${this.path}/create`,authorize, this.createCourse);
        this.router.post(`${this.path}/register`,authorize, this.registerToCourse);
        this.router.delete(`${this.path}/delete`,authorize, this.deleteCourse);
    }

    private getCourse = async (request: Request, response: Response) => {
        try {
            // @ts-ignore
            const course = await Course.findOne({courseCode: request.query.courseCode})
                .populate({
                    path: "professor",
                    model: "User"
                }
            );
            return response.status(200).json(course)
        } catch (error) {
            return response.status(400).json(error);
        }
    };

    private getCourseList = async (request: Request, response: Response) => {
        try {
            // @ts-ignore
            const user = await User.findById(request.user._id);
            let courseList = await Course.find();
            courseList = courseList.filter(course => !user.courses.includes(course._id));

            return response.status(200).json(courseList)
        } catch (error) {
            return response.status(400).json(error);
        }
    };

    private searchCourseList = async (request: Request, response: Response) => {
        try {
            // @ts-ignore
            const user = await User.findById(request.user._id);
            let courseList = await Course.find({$or:
                    [{courseCode: {$regex: new RegExp("^" + request.query.courseCode, "i")}},
                        {courseName: {$regex: new RegExp("^" + request.query.courseCode, "i")}}
                ]});

            courseList = courseList.filter(course => !user.courses.includes(course._id));
            return response.status(200).json(courseList)
        } catch (error) {
            return response.status(400).json(error);
        }
    };

    private createCourse = async (request: Request, response: Response) => {
        try {
            const course = new Course();
            // @ts-ignore
            const user = await User.findById(request.user._id);

            course.courseCode = request.body.courseCode.replace(/\s/g,'').toUpperCase();
            course.courseName = request.body.courseName;
            course.description = request.body.description;
            // @ts-ignore
            course.professor = request.user._id;

            // add new course to professor
            user.courses.push(course);

            await course.save();
            await user.save();
            return response.status(200).json(course);

        } catch (error) {
            return response.status(400).json("Invalid Course Code");
        }
    };

    private registerToCourse = async (request: Request, response: Response) => {
        try {
            const course = await Course.findOne({courseCode: request.body.courseCode})
            // @ts-ignore
            const user = await User.findById(request.user._id);

            // add new course to student
            user.courses.push(course);

            // register student to course
            course.students.push(user);

            // save models
            await course.save().catch(err=>console.log(err))
            await user.save().catch(err=>console.log(err))
            return response.status(200).json(course);

        } catch (error) {
            return response.status(400).json(error);
        }
    };


    private deleteCourse = async (request: Request, response: Response) => {
        try {
            // @ts-ignore
            const user = await User.findById(request.user._id);
            const course = await Course.findOne({courseCode: String(request.query.courseCode)})

            // Verify that the user trying to delete is the creator
            if(user._id.equals(course.professor)) {
                await Course.deleteOne({courseCode: String(request.query.courseCode)}).catch(err=> console.log(err));
                return response.status(200).json({message: "Success"});
            } else {
                return response.status(403).json({error: "Not authorized to remove this course"});
            }
        } catch (error) {
            return response.status(400).json(error);
        }
    };
}
