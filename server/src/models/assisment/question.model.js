import mongoose from "mongoose";

const QuestionModel = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    correctOption: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    category: {
        type: String,
        required: true,
        enum: ["Aptitude", "Reasoning", "Verbal", "Technical"]
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["Easy", "Medium", "Hard"]
    },
    explaination: {
        type: String,
        required: true
    }
})

const questionModel = mongoose.model("Question", QuestionModel);

export default questionModel