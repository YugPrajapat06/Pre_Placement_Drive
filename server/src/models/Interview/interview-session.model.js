import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: [true, "Candidate ID is required"],
    },
    interviewType: {
        type: String,
        required: [true, "Interview type is required"],
        enum: ["Technical", "Behavioral"]
    },
    currentQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewQuestion",
        default: null
    },
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["Active", "Waiting", "Completed"],
        default: "Waiting"
    },
    maxQuestion : {
        type: Number,
        default: 12
    },
    duration: {
        type: Number,
        default: 30
    },
    startTime : {
        type: Date ,
        default: null
    },
    endTime : {
        type: Date ,
        default: null
    }
},
    {
        timestamps: true
    })


export default mongoose.model("InterviewSession", interviewSessionSchema)