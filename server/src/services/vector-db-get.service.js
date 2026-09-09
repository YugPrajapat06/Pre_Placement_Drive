import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from '@pinecone-database/pinecone';


const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.PINECONE_INDEX)

const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: 'mistral-embed'
});

export const getFromPinecone = async (query, userId, type) => {

    const queryEmbedding = await embeddings.embedQuery(query)

    const result = await index.query({
        queryRequests: [{
            vector: queryEmbedding,
            topK: 2,
            includeMetadata: true,
            filter: {
                userId: { $eq: userId },
                type: { $eq: type }
            }
        }],
    });

    return result
}

