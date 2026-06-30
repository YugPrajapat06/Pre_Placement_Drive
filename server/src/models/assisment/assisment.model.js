import mongoose from "mongoose";

const AssismentSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    questionsId : {
        type : [mongoose.Schema.Types.ObjectId],
        required : true
    },

    startTime : new Date(),

    duration : 30,

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