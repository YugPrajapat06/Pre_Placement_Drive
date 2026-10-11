import { createSlice } from "@reduxjs/toolkit";


const interviewSlice = createSlice({
    name: 'interview',
    initialState: {
        session: null,
        type: null,
        startTime: null,
        endTime: null,
        isActive: false,
        currentQuestion: null,
        questionNo: 0,
        answer: null,
        loading: false,
        error: null,
        questionAnalysis: null
    },
    reducers: {
        setSession: (state, action) => {
            state.session = action.payload;
        },
        setType: (state, action) => {
            state.type = action.payload
        },
        setStartTime: (state, action) => {
            state.startTime = action.payload;
        },
        setEndTime: (state, action) => {
            state.endTime = action.payload;
        },
        setIsActive: (state, action) => {
            state.isActive = action.payload
        },
        setCurrentQuestion: (state, action) => {
            state.currentQuestion = action.payload;
        },
        setQuestionNo: (state, action) => {
            state.questionNo = action.payload;
        },
        setAnswer: (state, action) => {
            state.answer = action.payload;
        },
        setQuestionAnalysis: (state, action) => {
            state.questionAnalysis = action.payload;
        },
        setLoading: (state, action) => {
            state.loading =  action.payload
        },
        setError : (state, action) => {
            state.error = action.payload
        },
    }
})


export const { setSession, setType, setStartTime, setEndTime, setIsActive, setCurrentQuestion, setQuestionNo, setAnswer, setQuestionAnalysis, setLoading, setError } = interviewSlice.actions;
export default interviewSlice.reducer