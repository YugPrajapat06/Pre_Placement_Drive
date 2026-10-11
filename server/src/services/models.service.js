import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-flash-latest",
    apiKey: process.env.GEMINI_API_KEY
})

export const geminiModel2 = new ChatGoogleGenerativeAI({
    model : 'gemini-3.5-flash',
    apiKey : process.env.GEMINI_API_KEY
})

export const geminiModel3 = new ChatGoogleGenerativeAI({
    model : 'gemini-3.6-flash',
    apiKey : process.env.GEMINI_API_KEY
})

