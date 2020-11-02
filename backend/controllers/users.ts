import { authorize } from "../config/auth";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import Controller from "../interfaces/controller.interface";

export default class UserController implements Controller {
    public path = "/api/users";

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/get`,authorize, this.getUser);
    }

    private getUser = async (request: Request, response: Response) => {
        try {
            // @ts-ignore
            const user = await User.findById(request.user._id)
                .populate({
                    path: "courses",
                    model: "Course"
                })
            return response.status(200).json(user)
        } catch (error) {
            return response.status(400).json(error);
        }
    };
}
