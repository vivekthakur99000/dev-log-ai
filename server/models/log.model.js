import mongoose, { Schema } from "mongoose";

const logSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enum : ["standup", "pr", "weekly"],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    repoName : {
        type: String,
    },
    dateRange: {
        type: String,
    }
}, { timestamps: true });

const Log = mongoose.model("Log", logSchema);

export default Log;
