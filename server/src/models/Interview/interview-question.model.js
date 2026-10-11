import mongoose from "mongoose";
import { number, object } from "zod";

const interviewQuestionSchema = new mongoose.Schema({
    interviewSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewSession",
        required: [true, "Interview Session ID is required"],
    },
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    questionNo : {
        type : Number,
        default : 0
    },
    type: {
        type: String,
        required: [true, "Question type is required"]
    },
    topic: {
        type: String,
        required: [true, "Question topic is required"],
    },
    difficulty: {
        type: String,
        required: [true, "Question difficulty is required"],
        enum: ["Easy", "Medium", "Hard"]
    },
    yourAns: {
        type: String,
        default: null
    },
    transcript: {
        type : String,
        default : null
    },
    analysis: {
        type: Object,
        default: null
    }
},
    {
        timestamps: true
    })

export default mongoose.model("InterviewQuestion", interviewQuestionSchema);