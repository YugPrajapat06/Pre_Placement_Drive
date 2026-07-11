import { useDispatch, useSelector } from "react-redux";
import { createAssisment, getAllAssisments, getAssisment, submitAssisment, addQuestion, startAssisment } from "../services/assisment.api.js";
import { setActive, setCurrentAssisment, setAllAssisments, setLoading, setError } from "../slices/assisment.slice.js";

export function useAssisment() {
    const dispatch = useDispatch()

    async function handleCreateAssisment() {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const res = await createAssisment()
            dispatch(setCurrentAssisment(res))
            return res
        } catch (error) {
            const errorMessage = error.response?.data?.message
            dispatch(setError(errorMessage))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetAllAssisments() {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await getAllAssisments()
            dispatch(setAllAssisments(data))
            return true
        } catch (error) {
            const errorMessage = error.response?.data?.message
            dispatch(setError(errorMessage))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetAssisment(id) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await getAssisment(id)
            dispatch(setCurrentAssisment(data))
            return true
        } catch (error) {
            const errorMessage = error.response?.data?.message
            dispatch(setError(errorMessage))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleSubmitAssisment(id, data) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const res = await submitAssisment(id, data)
            dispatch(setCurrentAssisment(res))
            return true
        } catch (error) {
            const errorMessage = error.response?.data?.message
            dispatch(setError(errorMessage))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleStartAssisment(id) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const res = await startAssisment(id)
            return true
        } catch (error) {
            const errorMessage = error.response?.data?.message
            dispatch(setError(errorMessage))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }
    async function handleAddQuestion(data) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            await addQuestion(data)
            return true
        } catch (error) {
            const errorMessage = error.response?.data?.message
            dispatch(setError(errorMessage))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleCreateAssisment,
        handleGetAllAssisments,
        handleGetAssisment,
        handleSubmitAssisment,
        handleStartAssisment,
        handleAddQuestion
    }
}