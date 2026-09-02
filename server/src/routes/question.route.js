import express from "express"
import questionController from "../controllers/question.controller.js"
import { IdentifyUser } from "../middlewares/auth.middleware.js"
import authorize from "../middlewares/authorize.middleware.js"

const questionRouter = express.Router();

questionRouter.get("/", IdentifyUser, authorize("admin"), questionController.getAllQuestions);
questionRouter.get("/:topic", IdentifyUser, authorize("user","admin"), questionController.getQuestionsByTopic);


export default questionRouter
