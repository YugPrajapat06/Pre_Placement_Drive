import { PDFParse } from "pdf-parse";
import { parseResume } from "../services/resume-parsing.service.js";
import { uploadToPinecone } from "../services/vector-db-upload.service.js";

export async function ResumeParserMiddleware(req, res, next) {
    try {
        const userId = req.user.userId;
        if (!req.file) {
            return res.status(400).json({
                message: "Resume not found"
            });
        }

        const parser = new PDFParse({
            data: req.file.buffer
        });

        const result = await parser.getText();

        await parser.destroy();

        if (!result.text) {
            return res.status(400).json({
                message: "Resume not found"
            });
        }

        const response = await parseResume(result.text);


        //Vector-Db uploading process here

        const uploadResult = await uploadToPinecone(result.text, userId, 'resume');

        req.rawData = result.text;
        req.parsedData = response;

        // console.log("Parsed resume text:", result.text);

        next();

    } catch (error) {
        console.error("Error parsing resume:", error);

        return res.status(500).json({
            message: "Error parsing resume"
        });
    }
}