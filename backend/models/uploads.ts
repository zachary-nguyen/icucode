import {App} from "app-shared-codesets";
import {Document, model, Schema} from "mongoose";
import {SchemaDef} from "../AppSchemaTypes";
const ObjectId = Schema.Types.ObjectId;

interface UploadDoc extends App.Upload, Document{}

const uploadsSchemaDef: SchemaDef<App.Upload> = {
    assignmentName:{
       type: {},
       required: false
    },
    studentId:{
        type: ObjectId,
        ref: "User",
        required: true
    }
};

const uploadSchema = new Schema(uploadsSchemaDef, { timestamps: true });

export default model<UploadDoc>("Upload", uploadSchema);