import axios from "axios";

const api = axios.create({
    baseURL: "/api/question",
    withCredentials: true
});

export async function getQuestionsByTopic(topic) {
    try {
        const res = await api.get(`/${topic}`);
        return res.data;
    } catch (error) {
        console.log("Error in getQuestionsByTopic call: ", error.response?.data?.message);
        throw error;
    }
}

