import mongoose from "mongoose";
import { Password } from "../services/password";

// describes what it takes to create a user
interface UserAttrs {
    email: string;
    password: string;
}

// methods associated with the user model
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// describes what properties a single user has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// mongoose middleware, ran before saving
userSchema.pre("save", async function(done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});

// adding custom functions to schema
// user will be created via below for secure type checking
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

// model will return User of type UserModel
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };