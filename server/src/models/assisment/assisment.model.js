import mongoose from "mongoose";

const AssismentSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    questionsId : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Question",
        required : true
    },

    startTime : {
        type : Date,
        default : null
    },
    duration : {
        type : Number,
        default : 30
    },
    endTime : {
        type : Date,
        default : null
    },
    started: {
        type : Boolean,
        default : false
    },
    score : {
        type : Number,
        default : 0
    },
    isSubmitted : {
        type : Boolean,
        default : false
    }
},{timestamps : true})

const assismentModel = mongoose.model("Assisment", AssismentSchema);

export default assismentModel