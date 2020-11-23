import * as passport from "passport";
import { Strategy } from "passport-local";
import { authorize } from "../config/auth";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import Controller from "../interfaces/controller.interface";

export default class AuthenticationController implements Controller {
    public path = "/api/auth";

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registerUser);
        this.router.post(`${this.path}/login`, this.loginUser);
        this.router.patch(`${this.path}/change_email`, authorize, this.patchEmail);
        this.router.patch(
            `${this.path}/change_password`,
            authorize,
            this.patchPassword
        );
        this.router.patch(`${this.path}`, authorize, this.patchUser);
        this.router.delete(`${this.path}`, authorize, this.deleteUser);
        this.router.post(`${this.path}/resend_token`, this.resendToken);
        this.router.post(`${this.path}/reset_password`, this.resetPassword);
    }

    private registerUser = async (request: Request, response: Response) => {
        try {
            const user = new User();
            user.firstName = request.body.firstName;
            user.lastName= request.body.lastName;
            user.email = request.body.email;
            user.setPassword(request.body.password);
            user.facultyUser = false;
            await user.save();
            return response.status(200).json("success")
        } catch (error) {
            return response.status(400).json(error);
        }
    };

    private loginUser = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            // Use passport to authenticate user login
            await this.loginAuth();
            await passport.authenticate("local", (error, user) => {
                if (!user) {
                  return response.status(400).json({ error: error.message });
                }

                // ensure
                // if (!user.isVerified) return response.status(401).json({ error: "Account not verified" });
                // If login is valid generate a token and return it to the user
                const tokenSignature = user.generateJwt();
                return response.status(200).json({
                  userId: user.id,
                  email: user.email,
                  token: tokenSignature.token,
                  expiry: tokenSignature.expiry });
            })(request, response, next);
        } catch (error) {
            return response.status(400).json(error);
        }
    };

    private loginAuth = async () => {
        passport.use(
            new Strategy(
                { usernameField: "email" },
                async (username, password, done) => {
                    // fail early if proper credentials are missing. do not perform external request
                    if(username === "" || password === ""){
                      throw new Error("Invalid credentials");
                    }else if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(username))){
                      throw new Error("Invalid credentials");
                    }

                    try {
                        // Tries to find the user matching the given username, regexp helps to query with case insensitivity
                        const user = await User.findOne({
                            email: { $regex: new RegExp(username, "i") },
                        }).exec();
                        // Check if the password is valid
                        if (user && user.isPasswordValid(password)) {
                            return done(null, user);
                        } else {
                            // Throws an error if credentials are not valid
                            throw new Error("Invalid credentials");
                        }
                    } catch (error) {
                        return done(error);
                    }
                }
            )
        );
    };

    /**
     * Change user email
     */
    private patchEmail = async (request: Request, response: Response) => {
        try {
            return response.status(200).json("Success");
        } catch (error) {
            return response.status(458).json(error);
        }
    };

    private patchPassword = async (
        request: Request,
        response: Response
    ) => {
        try {
        } catch (error) {
            return response.status(459).json(error);
        }
    };

    // Placeholder Function to modify and save the user model when needed...
    private patchUser = async (request: Request, response: Response) => {
        try {
            return response.status(200).json("Success");
        } catch (error) {
            return response.status(460).json(error);
        }
    };

    // Deletes user...
    private deleteUser = async (request: Request, response: Response) => {
        try {
            return response.status(200).json("Success");
        } catch (error) {
            return response.status(461).json(error);
        }
    };

    private resendToken = async (request: Request, response: Response) => {
    };

    private resetPassword = async (request: Request, response: Response) => {
    };
}
