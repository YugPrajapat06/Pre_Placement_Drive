import { setAnswer, setType, setIsActive, setCurrentQuestion, setStartTime, setEndTime, setSession, setQuestionNo, setQuestionAnalysis, setLoading, setError } from "../slices/interview.slice.js";
import { createInterviewSession, startInterviewSession, endInterviewSession, askQuestion, submitAnswer } from "../services/interview.api.js";
import { useDispatch } from "react-redux";


export function useInterview() {

    const dispatch = useDispatch()

    async function handleCreateInterviewSession(interviewType) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null))
            dispatch(setAnswer(null))
            dispatch(setCurrentQuestion(null))
            dispatch(setStartTime(0))
            dispatch(setEndTime(0))
            dispatch(setIsActive(false))
            dispatch(setQuestionNo(0))
            dispatch(setSession(null))
            dispatch(setType(null))
            const data = await createInterviewSession(interviewType)
            console.log("Type Check : ", interviewType)
            dispatch(setSession(data.session))
            dispatch(setType(interviewType))
            return data.session
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Unable to create your interview session."));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleStartInterviewSession(interviewSessionId) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await startInterviewSession(interviewSessionId)
            dispatch(setSession(data.session))
            dispatch(setStartTime(data.session.startTime))
            dispatch(setEndTime(data.session.endTime))
            dispatch(setIsActive(true))
            return data.session
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Unable to start your interview session."));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleEndInterviewSession(interviewSessionId, datax) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await endInterviewSession(interviewSessionId, datax )
            dispatch(setSession(data.session));
            dispatch(setIsActive(false))
            dispatch(setStartTime(0))
            dispatch(setEndTime(0))
            return { success: true }
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Unable to end interview session."));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleAskQuestion( interviewSessionId ) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await askQuestion( interviewSessionId )
            dispatch(setCurrentQuestion(data.question))
            dispatch(setQuestionNo(data.question.questionNo));
            return data.question
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Unable to Generate interview question."));
            return false;
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleSubmitAnswer( interviewSessionId , questionId , formData) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await submitAnswer( interviewSessionId, questionId , formData)
            dispatch(setQuestionAnalysis(data.question?.analysis))
            dispatch(setCurrentQuestion(data.question))
            return data.question
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Unable to submit your answer."));
            return false;
        } finally {
            dispatch(setLoading(false))
        }
    }


    return {
        handleCreateInterviewSession,
        handleStartInterviewSession,
        handleEndInterviewSession,
        handleAskQuestion,
        handleSubmitAnswer
    }
}