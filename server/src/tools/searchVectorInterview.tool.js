import { tool } from "langchain";
import { z } from 'zod';
import { getFromPinecone } from "../services/vector-db-get.service.js";

export const searchVectorInterviewHistoryTool = tool(
    async ({ query }, config) => {
        const { userId, interviewSessionId } = config.configurable;

        const results = await getFromPinecone({
            query,
            userId,
            interviewSessionId,
            type: 'Interview'
        });
        console.log("vector interview tool calling ..")
        return JSON.stringify(results);
    },
    {
        name: "search_interview_history",
        description: `
        Search the candidate's previous interview history stored in the Pinecone vector database.

        Use this tool whenever you need information about:
        - Previously asked questions
        - Candidate's previous answers
        - Answer evaluations
        - Topics already discussed
        - Candidate strengths and weaknesses

        Use the latest conversation to create a semantic search query.

        Use the retrieved information to avoid repeating questions
        and to generate an appropriate next interview question.

        If no relevant interview history is found, return that no
        previous interview information is available.
        `,
        schema: z.object({
            query: z.string().describe(
                "A semantic search query describing the previous interview information needed, such as previously asked questions, candidate answers, answer evaluations, discussed topics, strengths, weaknesses, or knowledge gaps."
            )
        })
    }
)