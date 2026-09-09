import { Pinecone } from '@pinecone-database/pinecone';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { MistralAIEmbeddings } from '@langchain/mistralai';


const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.PINECONE_INDEX)

const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: 'mistral-embed'
});

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0
});

export const uploadToPinecone = async (data, userId, type) => {
    const chunks = await splitter.splitText(data);

    const docs = await Promise.all(chunks.map(async (chunk) => {
        const embedding = await embeddings.embedQuery(chunk)
        return {
            text: chunk,
            embedding
        }
    }))

    const result = await index.upsert({
        records : docs.map((doc, i) => ({
            id: `${userId}-${type}-${i}`,
            values: doc.embedding,
            metadata: {
                text: doc.text,
                userId: userId,
                type: type
            },
        }))
    });

    return result
}