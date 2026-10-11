import { tool } from "langchain";
import { z } from 'zod';
import { getFromPinecone } from "../services/vector-db-get.service.js";

export const searchVectorResumeTool = tool(
    async ({ query }, config) => {
        const { userId } = config.configurable;

        const results = await getFromPinecone({
            query,
            userId,
            type: 'resume'
        });

        console.log("vector resume tool calling ..")
        return JSON.stringify(results);
    },

    {
        name: "search_resume",
        description: `
      Search the candidate's resume in Pinecone.

      Use this tool when the conversation requires
      information about projects, skills, education,
      work experience, or resume details.

      Generate a semantic search query based on
      the candidate's latest message and conversation.
    `,
        schema: z.object({
            query: z.string().describe(
                "What information to search for in the resume"
            )
        })
    }
)
