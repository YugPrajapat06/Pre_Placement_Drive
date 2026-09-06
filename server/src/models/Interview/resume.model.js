import mongoose from 'mongoose';


const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    resume: {
        type: String,
        required: [true, "Resume is required"]
    },
    name: {
        type: String,
        required: [true, "Resume name is required"]
    },
    rawData: {
        type: String,
        default: null
    },
    parsedData: {
        type: Object,
        default: null
    }
},
    {
        timestamps: true
    })

const resumeModel = mongoose.model("Resume", resumeSchema);

export default resumeModel