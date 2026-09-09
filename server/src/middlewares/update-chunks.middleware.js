import resumeModel from '../models/Interview/resume.model.js';
import { deleteFromPinecone } from '../services/vector-db-delete.service.js';
import { uploadToPinecone } from '../services/vector-db-upload.service.js';

export async function updateChunks(req, res, next) {
    try {
        const userId = req.user.userId;
        const resumeId = req.params.resumeId;
        const type = "resume";

        if(!resumeId) return res.status(400).json({ message: "Resume id is required" });

        const resume = await resumeModel.findOne({ _id: resumeId, userId });
        if(!resume) return res.status(400).json({ message: "Resume not found" });

        const res = await deleteFromPinecone(userId, type);
        if(res){
            const upload = await uploadToPinecone( resume.rawData, userId, type);
        }

        next();
    } catch (error) {
        console.error("Error updating resume chunks:", error);
        return res.status(500).json({ message: "Error updating resume chunks" });
    }
}