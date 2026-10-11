import resumeModel from '../models/Interview/resume.model.js';
import { deleteFromPinecone } from '../services/vector-db-delete.service.js';
import { getFromPinecone } from '../services/vector-db-get.service.js';
import { uploadToPinecone } from '../services/vector-db-upload.service.js';

export async function updateChunks(req, res, next) {
    try {
        const userId = req.user.userId;
        const resumeId = req.params.resumeId;
        const type = "resume";

        if(!resumeId) return res.status(400).json({ message: "Resume id is required" });

        const resume = await resumeModel.findOne({ _id: resumeId, userId });
        if(!resume) return res.status(400).json({ message: "Resume not found" });

        const response = await deleteFromPinecone(userId, type);
        if(response){
            const upload = await uploadToPinecone( resume.rawData, userId, type, null);
        }

        next();
    } catch (error) {
        console.error("Error updating resume chunks:", error);
        return res.status(500).json({ message: "Error updating resume chunks" });
    }
}