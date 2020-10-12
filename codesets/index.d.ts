import {MongooseDocument} from "mongoose";

declare namespace App {

    interface User {
        firstName: string;
        lastName: string;
        email: string;
        hash: string;
        salt: string;
    }

    export type UserDoc = MongooseDocument & User;

}