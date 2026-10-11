import mongoose from "mongoose";

const interviewAnalysisSchema = new mongoose.Schema({
    interviewSessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewSession",
        required: [true, "Interview Session ID is required"],
    },
    technicalScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    communicationScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    problemSolvingScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    answerQuality: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    overallScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    strengths: {
        type: String,
        default: null
    },
    weeknesses: {
        type: String,
        default: null
    },
    finalFeedback: {
        type: String,
        default: null
    }

},
    {
        timestamps: true
    })

export default mongoose.model("InterviewAnalysis", interviewAnalysisSchema);