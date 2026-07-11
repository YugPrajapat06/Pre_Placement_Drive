import axios from "axios"

const api = axios.create({
    baseURL: "/api/assisment",
    withCredentials : true
})


export async function createAssisment(){
    try {
        const res = await api.post("/")
        return res.data
    } catch (error) {
        console.log("Error in createAssisment call: ", error.response?.data?.message)
        throw error
    }
}

export async function startAssisment(id) {
    try {
        const res = await api.post(`/${id}/start`)
        return res.data
    } catch (error) {
        console.log("Error in starting assisment call :", error.response?.data?.message)
        throw error
    }
}

export async function submitAssisment(id,data) {
    try {
        const res = await api.patch(`/${id}/submit`,data)
        return res.data
    } catch (error) {
        console.log("Error in submitAssisment call: ", error.response?.data?.message)
        throw error
    }
}

export async function getAllAssisments(){
    try {
        const res = await api.get("/history/get")
        return res.data
    } catch (error) {
        console.log("Error in getAllAssisments call: ", error.response?.data?.message)
        throw error
    }
}

export async function getAssisment(id) {
    try {
        const res = await api.get(`/${id}`)
        return res.data
    } catch (error) {
        console.log("Error in getAssisment call: ", error.response?.data?.message)
        throw error
    }
}

export async function addQuestion(data) {
    try {
        const res = await api.post("/add-question",data)
        return res.data
    } catch (error) {
        console.log("Error in addQuestion call: ", error.response?.data?.message)
        throw error
    }
}




