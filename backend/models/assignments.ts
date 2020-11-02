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
    submitted:{
       type: Boolean,
       required: true
    },
    grade: {
        type: String,
        required: false
    },
    courseId: {
        type: [ObjectId],
        ref: "Course",
        required: true
    }

};

const assignmentSchema = new Schema(assignmentSchemaDef, { timestamps: true });

// export const userModelName = "User";
export default model<AssignmentDoc>("Assignment", assignmentSchema);