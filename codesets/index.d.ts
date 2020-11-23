import {MongooseDocument} from "mongoose";

declare namespace App {

    interface User {
        firstName: string;
        lastName: string;
        email: string;
        hash: string;
        salt: string;
        facultyUser: boolean;
        // @ts-ignore
        courses: Course["_id"][];
    }

    interface Course {
        courseCode: string;
        courseName: string;
        // @ts-ignore
        courseAssignments: Assignment["_id"][];
        // @ts-ignore
        professor: User["_id"];
        // @ts-ignore
        ta: User["_id"][];
        // @ts-ignore
        students: User["_id"][];
        description: string;
    }

    interface Assignment {
        assignmentName: string;
        submitted: boolean;
        grade: String;
        // @ts-ignore
        courseId: Course["_id"];
        uploads: {};
    }

    interface Upload {
                
    }

    export type UserDoc = MongooseDocument & User;
}