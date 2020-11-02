import {App} from "app-shared-codesets";
import {Document, model, Schema} from "mongoose";
import {SchemaDef} from "../AppSchemaTypes";
const ObjectId = Schema.Types.ObjectId;

interface CourseDoc extends App.Course, Document{}

const coursesSchemaDef: SchemaDef<App.Course> = {
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
    courseName: {
        type: String,
        required: true
    },
    courseAssignments: {
        type: [],
        required: false
    },
    professor:{
        type: ObjectId,
        ref: "User",
        required: false
    },
    students: {
        type: [ObjectId],
        required: true,
        ref: "User",
        default: []
    },
    ta: {
        type: [ObjectId],
        required: true,
        ref: "User",
        default: []
    },
    description: {
        type: String,
        required: false
    }
};

const courseSchema = new Schema(coursesSchemaDef, { timestamps: true });

export default model<CourseDoc>("Course", courseSchema);