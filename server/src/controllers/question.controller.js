import questionModel from "../models/assisment/question.model.js";


const getAllQuestions = async (req, res) => {
    try {
        const questions = await questionModel.find();
        return res.status(200).json({ message: "Questions fetched successfully", questions });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching questions", error });
    }
};

const getQuestionsByTopic = async (req, res) => {
    try {
        const { topic } = req.params;
        const questions = await questionModel.find({ topic });
        return res.status(200).json({ message: "Questions fetched successfully", questions });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching questions", error });
    }
};

export default {
    getAllQuestions,
    getQuestionsByTopic
}