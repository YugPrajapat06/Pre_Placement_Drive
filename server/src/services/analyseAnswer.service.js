import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const answerAnalysisSchema = z.object({
    transcript: z.string(),

    evaluation: z.object({
        score: z.number().min(0).max(10),
        relevance: z.number().min(0).max(10),
        technicalAccuracy: z.number().min(0).max(10),
        completeness: z.number().min(0).max(10),

        isCorrect: z.boolean(),
        missingPoints: z.array(z.string()),
        feedback: z.string(),
        weaknesses: z.string(),
        strengths: z.string()
    })
});

const jsonSchema = z.toJSONSchema(answerAnalysisSchema);

export const AnalyzeAnswer = async (question, audio) => {

    const audioBase64 = audio.buffer.toString("base64");

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: [
            {
                text: `
You are an AI technical interviewer.

Interview Question:
${question}

Listen to the candidate's audio.

Tasks:
1. Transcribe the candidate's answer exactly.
2. Evaluate the answer.
3. Do not invent anything the candidate did not say.
4. Evaluate correctness, relevance, technical accuracy,
   completeness, strengths and weaknesses.

Return the result according to the provided schema.
`
            },
            {
                inlineData: {
                    mimeType: audio.mimetype,
                    data: audioBase64
                }
            }
        ],

        config: {
            responseMimeType: "application/json",
            responseSchema: jsonSchema
        }
    });

    return answerAnalysisSchema.parse(JSON.parse(response.text));
};