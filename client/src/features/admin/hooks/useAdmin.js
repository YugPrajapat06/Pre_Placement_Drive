import { useDispatch, useSelector } from "react-redux";
import { getQuestions } from "../services/admin.api.js"
import { setAllQuestions, setLoading, setError } from "../slices/admin.slice.js"

export function useAdmin() {
    const dispatch = useDispatch();

    async function handleGetAllQuestions() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getQuestions();
            dispatch(setAllQuestions(data));
            return data
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            dispatch(setError(errorMessage));
            return false
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleGetAllQuestions
    }
}