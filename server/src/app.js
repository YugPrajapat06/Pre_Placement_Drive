import express from "express"
import cookieParser from "cookie-parser"

import authRouter from "./routes/auth.route.js"
import assismentRouter from "./routes/assisment.route.js"
import questionRouter from "./routes/question.route.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/assisment", assismentRouter)
app.use("/api/admin", questionRouter)


export default app