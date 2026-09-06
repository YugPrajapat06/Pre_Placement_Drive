import express from "express";
import resumeController from "../controllers/resume.controller.js";
import { IdentifyUser } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import { ResumeParserMiddleware } from "../middlewares/resume-parser.middleware..js";

const resumeRouter = express.Router();


resumeRouter.post('/upload', IdentifyUser, upload.single('file'), ResumeParserMiddleware, resumeController.uploadResume);
resumeRouter.get('/get', IdentifyUser,  resumeController.getResume);
resumeRouter.get('/get/active/:resumeId', IdentifyUser, resumeController.getActiveResume);

export default resumeRouter