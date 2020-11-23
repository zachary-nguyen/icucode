import { authorize } from "../config/auth";
import * as express from "express";
import { Request, Response } from "express";
import Controller from "../interfaces/controller.interface";
import {upload_single} from "../middleware/upload";
import * as mongo from "mongodb"
import File from "../models/file";
import * as fs from "fs";

const Binary = mongo.Binary;

export default class FileUploadController implements Controller {
    public path = "/api/upload";

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post( `${this.path}/upload`, upload_single, this.uploadFile);
        this.router.get(`${this.path}/fetch`, this.getFile)
    }

    private uploadFile = async (request: Request, response: Response) => {
        try {
            const file = new File();

            // @ts-ignore
            const data: any = await fs.readFileSync(`./tmp/${request.file.filename}`, "utf8", (err,data) => {
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
            fs.unlinkSync(`./tmp/${request.file.filename}`);

            await file.save();
            return response.status(200).json("Uploaded")
        } catch (error) {
            console.log(error)
            return response.status(400).json(error);
        }
    };

    private getFile = async (request: Request, response: Response) => {
        try {
            const file = await File.findOne({_id: "5fbbd028dd29f6264c869bd1"});

            console.log(file)
            // @ts-ignore
            fs.writeFileSync(`./tmp/${file.meta_data.originalname}`, file.data.buffer, {});

            return response.status(200).json("fetched")
        } catch (error) {
            console.log(error)
            return response.status(400).json(error);
        }
    };
}
