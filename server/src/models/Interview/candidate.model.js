import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : [true, "User ID is required"],
        unique : [true, "Candidate already exists for this user"]
    },
    education : {
        college : String,
        course : String,
        branch : String,
        Experience : {
            type : String,
            enum : ["Fresher", "Internship", "Experienced"],
            default : "Fresher"
        },
        targetCompany : String,
        targetCompanyRole : String,
    },
    readiness : {
        score : {
            type : Number,
            default : 0
        },
    },
    activeResumeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Resume",
        default : null
    }

}, {
    timestamps : true
})

const candidateModel = mongoose.model("Candidate", candidateSchema);

export default candidateModel