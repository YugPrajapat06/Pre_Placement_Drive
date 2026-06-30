import assismentModel from "../models/assisment/assisment.model.js"
import questionModel from "../models/assisment/question.model.js"

const createAssisment = async (req, res) => {
    const userId = req.user.userId;
    try {
        const [
            aptiQuestion,
            reasoningQuestion,
            verbalQuestion,
            technicalQuestion
        ] = await Promise.all([
            questionModel.aggregate([
                { $match: { category: "Aptitude" } },
                { $sample: { size: 10 } }
            ]),
            questionModel.aggregate([
                { $match: { category: "Reasoning" } },
                { $sample: { size: 5 } }
            ]),
            questionModel.aggregate([
                { $match: { category: "Verbal" } },
                { $sample: { size: 10 } }
            ]),
            questionModel.aggregate([
                { $match: { category: "Technical" } },
                { $sample: { size: 5 } }
            ])
        ]);

        const questions = [...aptiQuestion, ...reasoningQuestion, ...verbalQuestion, ...technicalQuestion];



        const assisment = await assismentModel.create({ user: userId, questionsId: questions.map(question => question._id) });
        return res.status(201).json({ message: "Assisment created successfully", assisment });
    } catch (error) {
        return res.status(500).json({ message: "Error creating assisment", error });
    }
}

const submitAssisment = async (req, res) => {
    const { answers } = req.body
    const AssismentId = req.params.id
    /**
     * Answer is in the form
     * [{
     *      questionId : questionId,
     *      selectedOption : 0-3
     *  },....
     * ]
     */

    try {
        const assisment = await assismentModel.findById(AssismentId).populate("questionsId");
        if (!assisment) {
            return res.status(404).json({ message: "Assisment not found" });
        }

        if (assisment.isSubmitted) {
            return res.status(400).json({
                message: "Assessment already submitted."
            });
        }

        const endTime = new Date();
        const duration = Math.floor((endTime - assisment.startTime) / (1000 * 60));

        if (duration > assisment.duration) {
            return res.status(400).json({ message: "Time limit exceeded" });
        }

        const questionMap = new Map();
        
        assisment.questionsId.forEach(question => {
            questionMap.set(question._id.toString(), question);
        });

        let score = 0;
        answers.forEach(answer => {
            const question = questionMap.get(answer.questionId);
            if (question.correctOption === answer.selectedOption) {
                score += 1;
            }
        });

        assisment.score = score;
        assisment.isSubmitted = true;
        await assisment.save();
        return res.status(200).json({ message: "Assisment submitted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error submitting assisment", error });
    }
}

const getAssisments = async (req, res) => {
    const userId = req.user.userId
    try {
        const assisments = await assismentModel.find({ user: userId });
        return res.status(200).json({ message: "Assisments fetched successfully", assisments });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching assisments", error });
    }
}

const getAssisment = async (req, res) => {
    const assismentId = req.params.id
    try {
        const assisment = await assismentModel.findById(assismentId).populate("questionsId");

        if(!assisment){
            return res.status(404).json({ message: "Assisment not found" });
        }

        return res.status(200).json({
             message: "Assisment fetched successfully", 
             assisment 
        });

    } catch (error) {
        return res.status(500).json({ 
            message: "Error fetching assisment",
             error
        });
    }
}
const addQuestion = async (req, res) => {
    const { question, options, correctOption, category, difficulty, explaination } = req.body

    try {

        if (!question || !options || !correctOption || !category || !difficulty || !explaination) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (options.length < 2 || !Array.isArray(options)) {
            return res.status(400).json({ message: "Options must contain at least 2 options" });
        }

        const questionAlreadyExist = await questionModel.findOne({ question });

        if (questionAlreadyExist) {
            return res.status(409).json({ message: "Question already exist" });
        }
        const newQuestion = await questionModel.create({ question, options, correctOption, category, difficulty, explaination });
        return res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        return res.status(500).json({ message: "Error adding question", error });
    }
}

export default {
    createAssisment,
    submitAssisment,
    getAssisments,
    getAssisment,
    addQuestion
}