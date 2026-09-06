import { createSlice } from "@reduxjs/toolkit";


const resumeSlice = createSlice({
    name: "resume",
    initialState: {
        resume: [],
        activeResume: null,
        loading: false,
        error: null,
    },
    reducers: {
        setResume: (state, action) => {
            state.resume = action.payload;
        },
        setActiveResume: (state, action) => {
            state.activeResume = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
})

export const { setResume, setActiveResume, setLoading, setError } = resumeSlice.actions;
export default resumeSlice.reducer;