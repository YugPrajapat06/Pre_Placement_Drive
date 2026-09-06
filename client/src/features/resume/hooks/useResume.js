import { getResume, uploadResume, getActiveResume } from '../../resume/services/resume.api.js';
import { setResume, setLoading, setError, setActiveResume } from '../../resume/slices/resume.slice.js';
import { useDispatch } from 'react-redux';

export function useResume() {
    const dispatch = useDispatch();

    async function handleUploadResume(file, name, isDefault) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await uploadResume(file, name, isDefault);
            return { success: true, resume: data.resume };
        } catch (error) {
            dispatch(setError(error.message));
            return { success: false };
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetResume() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getResume();
            dispatch(setResume(data.resumes));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetActiveResume(resumeId) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getActiveResume(resumeId);
            dispatch(setActiveResume(data.activeResume))
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleUploadResume,
        handleGetResume,
        handleGetActiveResume
    }
}