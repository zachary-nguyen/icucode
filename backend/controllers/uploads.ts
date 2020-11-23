import { authorize } from "../config/auth";
import * as express from "express";
import { Request, Response } from "express";
import User from "../models/user";
import Controller from "../interfaces/controller.interface";
import Course from "../models/courses";
import Upload from "../models/courses";

export default class UploadController implements Controller {
    public path = "/api/uploads";

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/get`,authorize, this.getUpload);
    }

    private getUpload = async (request: Request, response: Response) => {
        try {
            // @ts-ignore
            const upload = await Upload.findOne({courseCode: request.query.courseCode})
                .populate({
                    path: "professor",
                    model: "User"
                }
            );
            return response.status(200).json(upload)
        } catch (error) {
            return response.status(400).json(error);
        }
    };

}
