import { PDFParse } from "pdf-parse";

export async function ResumeParserMiddleware(req, res, next) {
    try {
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

        req.rawData = result.text;

        // console.log("Parsed resume text:", result.text);

        next();

    } catch (error) {
        console.error("Error parsing resume:", error);

        return res.status(500).json({
            message: "Error parsing resume"
        });
    }
}