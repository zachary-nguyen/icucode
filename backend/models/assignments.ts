import {App} from "app-shared-codesets";
import {Document, model, Schema} from "mongoose";
import {SchemaDef} from "../AppSchemaTypes";
const ObjectId = Schema.Types.ObjectId;

interface AssignmentDoc extends App.Assignment, Document{}

const assignmentSchemaDef: SchemaDef<App.Assignment> = {
    assignmentName:{
       type: String,
       required: true
    },
    courseId: {
        type: ObjectId,
        ref: "Course",
        required: true
    },
    submissions: {
        type: [ObjectId],
        ref: "Upload",
        required: true,
        default: []
    }
};

const assignmentSchema = new Schema(assignmentSchemaDef, { timestamps: true });

export default model<AssignmentDoc>("Assignment", assignmentSchema);