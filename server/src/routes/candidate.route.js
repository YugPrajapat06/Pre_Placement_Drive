import express from 'express';
import candidateController from '../controllers/candidate.controller.js';
import { IdentifyUser } from '../middlewares/auth.middleware.js';


const candidateRouter = express.Router();

candidateRouter.post('/register', IdentifyUser, candidateController.registerCandidate);
candidateRouter.get('/profile', IdentifyUser, candidateController.getCandidateProfile);
candidateRouter.patch('/update/active-resume/:resumeId', IdentifyUser, candidateController.updateActiveResume);

export default candidateRouter