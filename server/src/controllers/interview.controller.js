import interviewSessionModel from "../models/Interview/interview-session.model.js";
import interviewQuestionModel from '../models/Interview/interview-question.model.js';
import candidateModel from "../models/Interview/Candidate.model.js";
import { askNextQuestion } from "../services/askQuestion.service.js";import imageKit, { toFile } from '@imagekit/nodejs';
import { AnalyzeAnswer } from "../services/analyseAnswer.service.js";
import { uploadToPinecone } from "../services/vector-db-upload.service.js";

const client = new imageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})


const createSession = async (req, res) => {

    try {
        const userId = req.user.userId
        const { interviewType } = req.body || 'Technical';
        const candidate = await candidateModel.findOne({ userId })
        if (!candidate) return res.status(404).json({ message: "Candidate not found" });

        if (candidate.activeResumeId == null) return res.status(404).json({ message: "Resume not found" });

        const session = await interviewSessionModel.create({
            userId,
            candidateId: candidate._id,
            interviewType: interviewType,
        })
        

        return res.status(200).json({
            message: 'Interview session created successfully',
            success: true,
            session
        })
    } catch (error) {
        console.error("Error In created interview session : ", error);
        return res.status(500).json({ message: "Error In created interview session" });

    }
}

const startSession = async (req, res) => {
    try {
        const sessionId = req.params.interviewSessionId

        const session = await interviewSessionModel.findById(sessionId)
        if (!session) return res.status(404).json({
            message: 'Interview session not found',
            success: false
        })

        if (session.status == "Active" || session.status == "Completed") {
            return res.status(409).json({
                message: 'Session already started or completed',
                success: false,
            })
        }

        const start = Date.now()
        session.status = 'Active'
        session.startTime = new Date(start)
        session.endTime = new Date(start + (session.duration * 60 * 1000))

        await session.save()

        return res.status(200).json({
            message: 'Interview session started',
            success: true,
            session
        })

    } catch (error) {
        console.error('Error in starting interview session : ', error);
        return res.status(500).json({
            message: 'Error in starting interview session',
            success: false,
            error
        })
    }
}

const endSession = async (req, res) => {
    try {
        const { interviewSessionId } = req.params
        const { technicalScore, communicationScore, problemSolvingScore, answerQuality, overallScore, strengths, weeknesses, finalFeedback } = req.body

        if (!interviewSessionId) return res.status(404).json({
            message: 'Interview session id not found',
            success: false
        })

        if (!technicalScore || !communicationScore || !problemSolvingScore || !answerQuality || !overallScore || !strengths || !weeknesses || !finalFeedback) return res.status(404).json({
            message: 'Required fields are empty to end session',
            success: false
        })

        const session = interviewSessionModel.findById(interviewSessionId)
        if (!session) return res.status(404).json({
            message: 'Interview session not found',
            success: false
        })

        if (session.status != 'Active') return res.status(409).json({
            message: 'Session is not active',
            success: false
        })

        const end = Date.now()

        if (end > session.endTime.getTime()) {
            return res.status(409).json({
                message: 'Session already ended',
                success: false
            })
        }

        session.status = 'Completed'
        await session.save()

        return res.status(200).json({
            message: 'Interview session ended',
            success: true,
            session
        })

    } catch (error) {
        console.error('Error in ending interview session : ', error);
        return res.status(500).json({
            message: 'Error in ending interview session',
            success: false,
            error
        })
    }
}

const askQuestion = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { interviewSessionId } = req.params;

        if (!interviewSessionId) {
            return res.status(400).json({
                message: "Session Id required",
                success: false
            });
        }

        const session = await interviewSessionModel.findById(interviewSessionId);

        if (!session) {
            return res.status(404).json({
                message: "Interview Session not found",
                success: false
            });
        }

        if (session.status !== "Active") {
            return res.status(409).json({
                message: "Interview Already Submitted or not started yet",
                success: false
            });
        }

        // currentQuestionIndex starts from 0
        if (session.currentQuestionIndex >= session.maxQuestion) {
            return res.status(400).json({
                message: "Completed All Questions",
                success: false
            });
        }

        const AiNextQuestion = await askNextQuestion(
            userId,
            interviewSessionId,
            session.interviewType
        );

        if (!AiNextQuestion) {
            return res.status(404).json({
                message: "Something is wrong with LLM to generate next question",
                success: false
            });
        }

        // Question number is index + 1
        const questionNo = session.currentQuestionIndex + 1;

        const question = await interviewQuestionModel.create({
            interviewSessionId,
            question: AiNextQuestion.question,
            questionNo,
            type: AiNextQuestion.type,
            topic: AiNextQuestion.topic,
            difficulty: AiNextQuestion.difficulty
        });

        // Update session
        session.currentQuestionIndex += 1;
        session.currentQuestion = question._id;

        await session.save();

        return res.status(200).json({
            message: "Question Generated successfully",
            success: true,
            question
        });

    } catch (error) {
        console.error("Error in Generating next question:", error);

        return res.status(500).json({
            message: "Error in Generating next question",
            success: false,
            error: error.message
        });
    }
};

const submitAnswer = async (req, res) => {
    try {
        const { interviewSessionId, questionId } = req.params;
        const userId = req.user.userId;
        const file = req.file

        console.log(file)
        if (!interviewSessionId || !questionId) {
            return res.status(400).json({
                message: "Session Id and Question Id required",
                success: false
            });
        }

        const session = await interviewSessionModel.findById(interviewSessionId);

        if (!session) {
            return res.status(404).json({
                message: "Interview Session not found",
                success: false
            });
        }

        if (session.status !== "Active") {
            return res.status(409).json({
                message: "Interview Already Submitted or not started yet",
                success: false
            });
        }

        if (session.currentQuestionIndex >= session.maxQuestion) {
            return res.status(400).json({
                message: "Completed All Questions",
                success: false
            });
        }

        const question = await interviewQuestionModel.findById(questionId);

        if (!question) {
            return res.status(404).json({
                message: "Question not found",
                success: false
            });
        }

        const audioFile = await client.files.upload({
            file : await toFile(file.buffer),
            fileName : file.originalname,
            folder : "interview-answers"
        })

        const response = await AnalyzeAnswer(question.question, file)

        question.yourAns = audioFile.url;
        question.transcript = response.transcript;
        question.analysis = response.evaluation;
        await question.save();

        const interviewText = `
            Question: ${question.question},
            Candidates Answer : ${question.transcript},

            Evaluation : 
            - score: ${question.analysis.score}
            - relevance : ${question.analysis.relevance}
            - technicalAccuracy: ${question.analysis.technicalAccuracy};
            - completeness: ${question.analysis.completeness};
            - isCorrect: ${question.analysis.isCorrect};
            - missingPoints: ${question.analysis.missingPoints};
            - feedback: ${question.analysis.feedback};
            - weaknesses: ${question.analysis.weaknesses};
            - strengths: ${question.analysis.strengths};
        `

        await uploadToPinecone(interviewText, userId, "Interview", session._id)

        return res.status(200).json({
            message: "Answer submitted successfully",
            success: true,
            question
        });


    } catch (error) {
        console.error("Error in submitting answer:", error);

        return res.status(500).json({
            message: "Error in submitting answer",
            success: false,
            error: error.message
        });
    }
}

export default {
    createSession,
    startSession,
    endSession,
    askQuestion,
    submitAnswer
}