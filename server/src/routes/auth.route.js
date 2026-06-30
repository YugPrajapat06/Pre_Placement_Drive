import express from "express";
import authController from "../controllers/auth.controller.js";
import { IdentifyUser } from "../middlewares/auth.middleware.js";
import { loginValidator, registerValidator } from "../validator/auth.validator.js";

const authRouter = express.Router();

authRouter.post("/register",registerValidator, authController.registerCtlr);
authRouter.post("/login",loginValidator, authController.loginCtlr);
authRouter.get("/get-me", IdentifyUser ,authController.getMeCtlr);    

export default authRouter;