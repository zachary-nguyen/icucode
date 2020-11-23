import {App} from "app-shared-codesets";
import {Document, model, Schema} from "mongoose";
import {SchemaDef} from "../AppSchemaTypes";

interface FileDoc extends App.File, Document{}

const fileSchemaDef: SchemaDef<App.File> = {
    data: {
        type: {},
        required: true
    },
    meta_data: {
        type: {},
        required: false
    }
};

const fileSchema = new Schema(fileSchemaDef, { timestamps: true });

// export const userModelName = "User";
export default model<FileDoc>("File", fileSchema);