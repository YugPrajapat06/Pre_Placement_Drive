import { createSlice } from "@reduxjs/toolkit"


const skillSlice = createSlice({
    name: "skill",
    initialState: {
        questions: [],
        topics: [],
        selectedTopic: null,
        loading: false,
        error: null
    },
    reducers: {
        setQuestions: (state, action) => {
            state.questions = action.payload
        },
        setTopics: (state, action) => {
            state.topics = action.payload
        },
        setSelectedTopic: (state, action) => {
            state.selectedTopic = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setQuestions, setTopics, setSelectedTopic, setLoading, setError } = skillSlice.actions
export default skillSlice.reducer