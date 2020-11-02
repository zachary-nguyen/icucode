import { pbkdf2Sync, randomBytes } from "crypto";
import { sign } from "jsonwebtoken";
import { Document, model, Schema } from "mongoose";
import { SchemaDef } from "../AppSchemaTypes";
import { App } from "app-shared-codesets";
const ObjectId = Schema.Types.ObjectId;

interface UserDoc extends App.User, Document{
    setPassword(password: string): void;
    isPasswordValid(password: string): boolean;
    generateJwt(): { token: string; expiry: Date };
    generatePasswordReset(): void;
    generateVerificationToken(): any;
}

const userSchemaDef: SchemaDef<App.User> = {
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
        required: true,
    },
    facultyUser: {
        type: Boolean,
        required: true,
    },
    courses: {
        type: [ObjectId],
        ref: "User",
        required: true,
        default: []
    }
};

class UserClass {
    private id: string;
    private firstName: string;
    private lastName: string;
    private email: string;
    private salt: string;
    private hash: string;
    private resetPasswordToken: string;
    private resetPasswordExpires: Date;

    public setPropeties(firstName: string, lastName: string, email: string){
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
    }

    public setPassword(password: string) {
        this.salt = randomBytes(16).toString("hex");
        this.hash = pbkdf2Sync(password, this.salt, 100000, 512, "sha512").toString(
            "hex"
        );
    }

    public isPasswordValid(password: string): boolean {
        const hash = pbkdf2Sync(
            password,
            this.salt,
            100000,
            512,
            "sha512"
        ).toString("hex");
        return this.hash === hash;
    }

    public generateJwt(): { token: string; expiry: Date } {
        const expiry = new Date();
        const extraMinutes = process.env.NODE_ENV === "development" ? 3000 : 320;
        console.log("node_env: ", process.env.NODE_ENV);

        expiry.setMinutes(expiry.getMinutes() + extraMinutes);

        const token = sign(
            {
                _id: this.id,
                email: this.email,
                exp: Math.round(expiry.getTime() / 1000),
            },
            process.env.AUTH_SHARED_SECRET
        );

        return { token, expiry };
    }

    public generatePasswordReset(): void {
        this.resetPasswordToken = randomBytes(20).toString("hex");
        const date = new Date();
        date.setHours(date.getHours() + 1);
        this.resetPasswordExpires = date; //1 hour expires
    }
}

const userSchema = new Schema(userSchemaDef, { timestamps: true });
userSchema.loadClass(UserClass);

// export const userModelName = "User";
export default model<UserDoc>("User", userSchema);
