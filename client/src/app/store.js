import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slices/auth.slice.js";
import assismentReducer from "../features/assissment/slices/assisment.slice.js";
import adminReducer from "../features/admin/slices/admin.slice.js"
import skillReducer from "../features/skill-build/slices/skill.slice.js"
import candidateReducer from "../features/Interview/slices/candidate.slice.js";
import resumeReducer from '../features/resume/slices/resume.slice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assisment: assismentReducer,
    admin : adminReducer,
    skill: skillReducer,
    candidate: candidateReducer,
    resume: resumeReducer,
  },
});
