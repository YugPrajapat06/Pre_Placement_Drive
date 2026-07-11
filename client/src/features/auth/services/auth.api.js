import axios from "axios";

const api = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
})

export async function register(data) {
    try {
        const res = await api.post("/register", data);
        return res.data;
    } catch (error) {
        console.log("Error in register call: ", error.response?.data?.message);
        throw error;
    }
}

export async function login(data) {
    try {
        const res = await api.post("/login", data);
        return res.data;
    } catch (error) {
        console.log("Error in login call: ", error.response?.data?.message);
        throw error;
    }
}

export async function getMe() {
    try {
        const res = await api.get("/get-me");
        console.log("check l32 ", res.data);
        return res.data;
        
    } catch (error) {
        console.log("Error in getMe call: ", error.response?.data?.message);
        throw error;
    }
}