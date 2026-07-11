import express from "express"
import assismentController from "../controllers/assisment.controller.js";
import { IdentifyUser } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const assismentRouter = express.Router();

assismentRouter.post("/",IdentifyUser, assismentController.createAssisment);
assismentRouter.post("/:id/start", assismentController.startAssisment)
assismentRouter.patch("/:id/submit", IdentifyUser, assismentController.submitAssisment);
assismentRouter.get("/history/get", IdentifyUser, assismentController.getAssisments);
assismentRouter.get("/:id", assismentController.getAssisment);
assismentRouter.post("/add-question",IdentifyUser, authorize("admin"), assismentController.addQuestion);

export default assismentRouter