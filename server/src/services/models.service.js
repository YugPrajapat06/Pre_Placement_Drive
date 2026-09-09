import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY
})