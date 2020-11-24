import {App} from "app-shared-codesets";
import {Document, model, Schema} from "mongoose";
import {SchemaDef} from "../AppSchemaTypes";
const ObjectId = Schema.Types.ObjectId;

interface SubmissionDoc extends App.Submission, Document{}

const submissionSchemaDef: SchemaDef<App.Submission> = {
    studentId:{
        type: ObjectId,
        ref: "User",
        unique: true,
        required: true
    },
    grade: {
        type: String,
        required: false
    },
    submitted:{
        type: Boolean,
        required: true,
    },
    files: {
        type: [ObjectId],
        ref: "File",
        required: true,
        default: []
    }
};

const submissionSchema = new Schema(submissionSchemaDef, { timestamps: true });

export default model<SubmissionDoc>("Submission", submissionSchema);