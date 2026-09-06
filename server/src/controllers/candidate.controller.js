import candidateModel from "../models/Interview/Candidate.model.js";


const registerCandidate = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { college, course, branch, Experience, targetCompany, targetCompanyRole } = req.body;

        if (!college || !course || !branch || !Experience || !targetCompany || !targetCompanyRole) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const existingCandidate = await candidateModel.findOne({ userId });
        if (existingCandidate) {
            return res.status(400).json({
                message: "Candidate already exists for this user",
                success: false
            });
        }

        const newCandidate = await candidateModel.create({
            userId,
            education: { college, course, branch, Experience, targetCompany, targetCompanyRole }
        });

        return res.status(200).json({
            message: "Candidate registered successfully",
            success: true,
            candidate: newCandidate
        });
    } catch (error) {
        console.error("Error registering candidate:", error);
        return res.status(500).json({
            message: "Error registering candidate",
            success: false
        });
    }
}

const getCandidateProfile = async (req, res) => {
    try {
        const candidate = await candidateModel.findOne({ userId: req.user.userId });

        if (!candidate) {
            return res.status(404).json({
                message: "Candidate profile not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Candidate profile fetched successfully",
            success: true,
            candidate
        });
    } catch (error) {
        console.error("Error fetching candidate profile:", error);
        return res.status(500).json({
            message: "Error fetching candidate profile",
            success: false
        });
    }
}

const updateActiveResume = async (req, res) => {
    try {
        const { resumeId } = req.params
        const userId = req.user.userId
        if (!resumeId) return res.status(400).json({ message: "Resume id is required" });

        const candidate = await candidateModel.findOneAndUpdate({ userId }, { $set: { activeResumeId: resumeId } }, {  returnDocument: 'after' })
        if (!candidate) return res.status(400).json({
            message: "Candidate not found"
        });
        return res.status(200).json({
            message: "Resume updated successfully",
            candidate,
            success: true,
            activeResume: candidate.activeResumeId
        })

    } catch (error) {
        console.error("Error Update Active Resume:", error);
        return res.status(500).json({
            message: "Error Update Active Resume",
            success: false
        });
    }
}

export default {
    registerCandidate,
    getCandidateProfile,
    updateActiveResume
}