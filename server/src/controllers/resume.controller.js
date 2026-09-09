import resumeModel from "../models/Interview/resume.model.js";
import candidateModel from "../models/Interview/Candidate.model.js";
import imageKit, { toFile } from '@imagekit/nodejs';

const client = new imageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})
const uploadResume = async (req, res) => {
    try {
        const file = req.file;
        const rawData = req.rawData;
        const parsedData = req.parsedData;
        const { name, isDefault } = req.body;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const uploadResponse = await client.files.upload({
            file: await toFile(file.buffer),
            fileName: file.originalname,
            folder: "resume"
        })

        const newResume = await resumeModel.create({
            userId: req.user.userId,
            resume: uploadResponse.url,
            name: name,
            rawData: rawData,
            parsedData: parsedData,
        })

        if (isDefault === 'true') {
            await candidateModel.findOneAndUpdate(
                { userId: req.user.userId },
                { $set: { activeResumeId: newResume._id } },
                { returnDocument: 'after' }
            );
        }
        console.log(newResume);
        

        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",
            resume: newResume,
            resumeUrl: uploadResponse.url
        })

    } catch (error) {
        console.error("Error uploading resume:", error);
        return res.status(500).json({ message: "Error uploading resume" });
    }
}

const getResume = async (req, res) => {
    try {
        const userId = req.user.userId;

        const resumes = await resumeModel.find({ userId });

        if (!resumes) {
            return res.status(404).json({
                message: "Resume not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Resume fetched successfully",
            success: true,
            resumes
        });

    } catch (error) {
        console.error("Error fetching resume:", error);
        return res.status(500).json({ message: "Error fetching resume" });
    }
}

const getActiveResume = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { resumeId } = req.params;

        if (!resumeId) {
            return res.status(400).json({ message: "Resume id is required" });
        }

        const activeResume = await resumeModel.findOne({ userId, _id: resumeId });

        if (!activeResume) {
            return res.status(404).json({
                message: "Active Resume not found"
            });
        }
        return res.status(200).json({
            message: "Active Resume fetched successfully",
            activeResume
        });

    } catch (error) {
        console.error("Error fetching active resume:", error);
        return res.status(500).json({ message: "Error fetching active resume" });
    }
}
export default {
    uploadResume,
    getResume,
    getActiveResume
}