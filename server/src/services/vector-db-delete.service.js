import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = pc.index(process.env.PINECONE_INDEX)

export const deleteFromPinecone = async (userId, type) => {
    try {
        await index.deleteMany({
            filter: {
                userId: { $eq: userId },
                type: { $eq: type }
            }
        })
        return true
    } catch (error) {
        console.log("Error in delete chunks from pinecone : ", error);
        return false
    }
}   
