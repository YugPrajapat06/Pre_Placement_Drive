import { register, login, getMe } from "../services/auth.api.js";
import { setUser, setLoading, setError } from "../slices/auth.slice.js";
import { useDispatch } from "react-redux"

export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister(data) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const res = await register(data);
            dispatch(setUser(res.user));
            return true
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            dispatch(setError(errorMessage));
            return false
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin(data) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const res = await login(data);
            dispatch(setUser(res.user));
            return true
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            dispatch(setError(errorMessage));
            return false
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getMe();
            dispatch(setUser(data.user));
            console.log(data.user);
            
            return true
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            dispatch(setError(errorMessage));
            return false
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { handleRegister, handleLogin, handleGetMe }
}