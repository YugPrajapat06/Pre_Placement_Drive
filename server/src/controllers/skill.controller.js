import questionModel from "../models/assisment/question.model.js";


const getAllTopics = async (req, res) => {
    try {
        const topics = await questionModel.distinct('topic');
        if(!topics) return res.status(404).json({ message: "Topics not found" });
        return res.status(200).json({ message: "Topics fetched successfully", topics });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching topics", error });
    }
}

const getAllTopicsByCategory = async (req, res) => {
    try {
        const {category} = req.params;
        if(!category) return res.status(400).json({ message: "Category is required" });
        
        const topics = await questionModel.distinct('topic', {category : category});
        return res.status(200).json({ message: "Topics fetched successfully", topics });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching topics by categoty", error });
    }
}

export default { getAllTopics, getAllTopicsByCategory};