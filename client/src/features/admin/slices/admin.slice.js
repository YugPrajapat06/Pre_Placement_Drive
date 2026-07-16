import { createSlice } from "@reduxjs/toolkit"

const adminSlice = createSlice({
    name: "admin",
    initialState : {
        questions: [],
        loading : false,
        error : null
    },
    reducers : {
        setAllQuestions : (state, action)=>{
            const payload = action.payload;
            state.questions = Array.isArray(payload) ? payload : payload?.questions || [];
        },
        setLoading : (state, action)=>{
            state.loading = action.payload
        },
        setError : (state, action)=>{
            state.error = action.payload
        }
    }
})

export const { setAllQuestions, setLoading, setError } = adminSlice.actions
export default adminSlice.reducer