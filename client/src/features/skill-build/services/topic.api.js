import axios from 'axios';

const api = axios.create({
    baseURL: "/api/skill",
    withCredentials: true
})

export async function getTopics() {
    try {
        const res = await api.get("/topic");
        return res.data;
    } catch (error) {
        console.log("Error in getTopics call: ", error.response?.data?.message);
        throw error;
    }
}

export async function getTopicsByCategory(category) {
    try {
        const res = await api.get(`/topic/${category}`);
        return res.data;
        
    } catch (error) {
        console.log("Error in getTopicsByCategory call: ", error.response?.data?.message);
        throw error;
    }
}