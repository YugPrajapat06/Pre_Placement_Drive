import axios from 'axios'

const api = axios.create({
    baseURL: "/api/admin",
    withCredentials: true
})

export async function getQuestions() {
    try {
        const res = await api.get("/")
        return res.data
    } catch (error) {
        console.log("Error in getQuestions call: ", error.response?.data?.message)
        throw error
    }
}