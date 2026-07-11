import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/slices/auth.slice.js";
import assismentReducer from "../features/assissment/slices/assisment.slice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    assisment: assismentReducer,
  },
});
