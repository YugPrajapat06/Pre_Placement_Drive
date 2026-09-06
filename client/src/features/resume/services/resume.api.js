import axios from "axios";

const api = axios.create({
    baseURL: "/api/resume",
    withCredentials: true
})

export async function uploadResume(file, name, isDefault) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name); // Append the resume name to the form data
        formData.append("isDefault", isDefault); // Append the default status to the form data

        const res = await api.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data;
    } catch (error) {
        console.log("Error in uploadResume call: ", error.response?.data?.message);
        throw error;
    }
}

export async function getResume() {
    try {
        const res = await api.get("/get");
        return res.data;
    } catch (error) {
        console.log("Error in getResume call: ", error.response?.data?.message);
        throw error;
    }
}

export async function getActiveResume (resumeId){
    try {
        const res = await api.get(`/get/active/${resumeId}`);
        return res.data;
    } catch (error) {
        console.log("Error in getActiveResume call: ", error.response?.data?.message);
        throw error;
    }
}