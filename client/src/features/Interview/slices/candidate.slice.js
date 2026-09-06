import { createSlice } from "@reduxjs/toolkit";

const candidateSlice = createSlice({
    name: "candidate",
    initialState: {
        profile: null,
        loading: false,
        error: null,
        profileStatus: "idle",
    },
    reducers: {
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setProfileStatus: (state, action) => {
            state.profileStatus = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setProfile, setProfileStatus, setLoading, setError } = candidateSlice.actions;
export default candidateSlice.reducer;