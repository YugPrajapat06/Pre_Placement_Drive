import express from "express"
import cookieParser from "cookie-parser"

import authRouter from "./routes/auth.route.js"
import assismentRouter from "./routes/assisment.route.js"
import questionRouter from "./routes/question.route.js"
import skillRouter from "./routes/skill.route.js"
import candidateRouter from "./routes/candidate.route.js"
import resumeRouter from "./routes/resume.route.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter);
app.use("/api/assisment", assismentRouter);
app.use("/api/question", questionRouter);
app.use("/api/skill", skillRouter);
app.use('/api/candidate', candidateRouter);
app.use('/api/resume', resumeRouter);


export default app