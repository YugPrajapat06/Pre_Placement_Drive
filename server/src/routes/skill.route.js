import express from "express"
import { IdentifyUser } from "../middlewares/auth.middleware.js"
import authorize from "../middlewares/authorize.middleware.js"
import skillController from "../controllers/skill.controller.js";

const skillRouter = express.Router();

skillRouter.get("/topic", IdentifyUser, authorize("user", "admin"), skillController.getAllTopics);
skillRouter.get("/topic/:category", IdentifyUser, authorize("user","admin"), skillController.getAllTopicsByCategory);


export default skillRouter