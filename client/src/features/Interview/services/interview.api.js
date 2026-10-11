import axios from "axios";

const api = axios.create({
    baseURL: '/api/interview',
    withCredentials: true
});

export async function createInterviewSession(interviewType) {
    // console.log('type check 2 : ', interviewType);
    
    const res = await api.post('/create',  {interviewType} );
    return res.data;
};


export async function startInterviewSession(interviewSessionId) {
    const res = await api.post(`/start/${interviewSessionId}`);
    return res.data;
}

export async function endInterviewSession(interviewSessionId, data) {
    const res = await api.post(`/end/${interviewSessionId}`, data);
    return res.data;
}

export async function askQuestion(interviewSessionId) {
    const res = await api.post(`/ask-question/${interviewSessionId}`);
    return res.data;
}

export async function submitAnswer(interviewSessionId, questionId, formData) {
    const res = await api.patch(`submit-answer/${interviewSessionId}/${questionId}`, formData);
    return res.data;
}


