import express from 'express';
import interviewController from '../controllers/interview.controller.js';
import { IdentifyUser } from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import audioUpload from '../middlewares/multer.audio.middleware.js';


const interviewRouter = express.Router();


interviewRouter.post('/create', IdentifyUser, authorize('admin', 'user'), interviewController.createSession);
interviewRouter.post('/start/:interviewSessionId', IdentifyUser, authorize('admin', 'user'), interviewController.startSession);
interviewRouter.post('/end/:interviewSessionId', IdentifyUser, authorize('admin', 'user'), interviewController.endSession);
interviewRouter.post('/ask-question/:interviewSessionId', IdentifyUser, authorize('admin', 'user'), interviewController.askQuestion);
interviewRouter.patch('/submit-answer/:interviewSessionId/:questionId', audioUpload.single('answerAudio'), IdentifyUser, authorize('admin', 'user'), interviewController.submitAnswer);

export default interviewRouter