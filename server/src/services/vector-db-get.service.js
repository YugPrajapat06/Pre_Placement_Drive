import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from '@pinecone-database/pinecone';


const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.PINECONE_INDEX)

const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: 'mistral-embed'
});

export const getFromPinecone = async (query, userId, type, interviewSessionId) => {

    const queryEmbedding = await embeddings.embedQuery(query)

    const result = await index.query({
        vector: queryEmbedding,
        topK: 2,
        includeMetadata: true,
        filter: {
            userId: { $eq: userId },
            type: { $eq: type },
            ...(type === "Interview" && interviewSessionId
                ? {
                    interviewSessionId: {
                        $eq: interviewSessionId
                    }
                }
                : {})
        }
    });

    return result
}

