import { createSlice } from "@reduxjs/toolkit"

const assismentSlice = createSlice({
    name: "assisment",
    initialState: {
        allAssisments: [],
        currentAssisment: null,
        isActive: false,
        loading: false,
        error: null
    },
    reducers: {
        setAllAssisments: (state, action) => {
            state.allAssisments = action.payload
        },
        setCurrentAssisment: (state, action) => {
            state.currentAssisment = action.payload
        },
        setActive: (state, action) => {
            state.active = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const { setAllAssisments, setCurrentAssisment, setActive, setLoading, setError } = assismentSlice.actions
export default assismentSlice.reducer