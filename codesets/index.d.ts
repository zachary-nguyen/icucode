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
        // @ts-ignore
        courseId: Course["_id"];
        // @ts-ignore
        submissions: Submission["_id"][];
    }

    interface Submission {
        // @ts-ignore
        studentId: User["_id"];
        // @ts-ignore
        files: File["_id"][];
        submitted: boolean;
        compiled: boolean;
        grade: String;
    }

    interface File {
        data: any;
        meta_data: any;
    }

    export type UserDoc = MongooseDocument & User;
}