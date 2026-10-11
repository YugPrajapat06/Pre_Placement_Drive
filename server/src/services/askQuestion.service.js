import { searchVectorInterviewHistoryTool } from "../tools/searchVectorInterview.tool.js";
import { searchVectorResumeTool } from "../tools/searchVectorResume.tool.js";
import { geminiModel2 } from "./models.service.js";
import { getFromPinecone } from "./vector-db-get.service.js";
import { createAgent } from "langchain";
import { z } from "zod";

const questionSchema = z.object({
    question: z.string(),
    type: z.enum(["Technical", "Behavioral"]),
    topic: z.string(),
    difficulty: z.enum(["Easy", "Medium", "Hard"])
});

const interviewAgent = createAgent({
    model: geminiModel2,
    tools: [searchVectorResumeTool, searchVectorInterviewHistoryTool],
    responseFormat: questionSchema,
    systemPrompt: `
        You are an Professional AI interviewer responsible for conducting
        a personalized, sequential interview.

        MANDATORY WORKFLOW:

        1. Before generating a question, call searchVectorResumeTool
           to retrieve the candidate's resume information.
            
        2. Call searchVectorInterviewHistoryTool to retrieve
           previous interview questions, answers, and evaluations information.

        3. Use the retrieved information to generate the next
           appropriate question.
            - analyze the work experience of candidate from there resume detail and make question accordingly.

        4. Never repeat a question already asked in this session.

        5. For technical interviews:
           - Ask about the candidate's actual skills and projects.
           - Use previous answers to decide the next question.
           - Ask follow-up questions when appropriate.
           - Gradually adjust difficulty based on performance.

        6. For behavioral interviews:
           - Ask about experiences, teamwork, challenges,
             decision-making, and problem-solving.
           - Personalize questions using resume information.

        7. If resume information is unavailable, ask a relevant
           general question for the selected interview type.

        8. If interview history is unavailable, do NOT automatically
           ask "Please introduce yourself."
           Only ask that question when explicitly instructed that
           this is the first question of a new session.

        9. Return exactly one new question in the required
           structured response format.

        10. Fist question start with introduction of candidate

        Do not invent candidate details.

        `
})

export const askNextQuestion = async (userId, interviewSessionId, interviewType) => {
    try {
        // 1. Retrieve resume context
        const resumeContext = await getFromPinecone(
            `Give me information of candidate from resume like Candidate personal info, skills, education, experience, projects and technologies`,
            userId,
            "resume",
            null
        );

        console.log("Resume context:", resumeContext);

        // 2. Retrieve interview history
        const interviewHistory = await getFromPinecone(
            `Give me Candidate's important interview information part including, Previous interview questions, candidate answers, evaluations, strengths and weaknesses`,
            userId,
            "Interview",
            interviewSessionId
        );

        console.log("Interview history:", interviewHistory);

        // 3. Pass retrieved information to the agent
        const result = await interviewAgent.invoke({
            messages: [{
                role: "user",
                content: `
                    Generate the next interview question.

                    Interview type: ${interviewType}

                    Candidate resume context:
                    ${resumeContext.matches[0]?.metadata?.text}

                    Previous interview history:
                    ${interviewHistory.matches[0]?.metadata?.text}

                    Rules:
                    - Use the retrieved context to personalize the question.
                    - Do not repeat previously asked questions.
                    - For technical interviews, focus on relevant technical skills.
                    - For behavioral interviews, focus on behavioral scenarios.
                    - If the history is empty, ask a suitable question based on
                      the resume and interview type.
                    - Do not automatically ask "Please introduce yourself."
                    - Return one question only.
                    `
            }]
        });

        return result.structuredResponse;

    } catch (error) {
        console.error("Error in askNextQuestion:", error);
        throw error;
    }

}