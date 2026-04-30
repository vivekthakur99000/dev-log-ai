import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    githubId: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
    },
    avatarUrl: {
        type: String,
    },
    accessToken: {
        type: String,
        required: false,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;


