import { getTopics, getTopicsByCategory } from "../services/topic.api";
import { getQuestionsByTopic } from "../services/question.api";
import { setQuestions, setTopics, setSelectedTopic, setLoading, setError } from "../slices/skill.slice";
import { useDispatch } from "react-redux";


export function useSkill() {
    const dispatch = useDispatch();

    async function handleGetTopics() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getTopics();
            dispatch(setTopics(data.topics));
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            dispatch(setError(errorMessage));
            return false
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetTopicsByCategory(category) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getTopicsByCategory(category);
            dispatch(setTopics(data.topics));
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            dispatch(setError(errorMessage));
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetQuestions(topic) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getQuestionsByTopic(topic);
            dispatch(setQuestions(data.questions));
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            dispatch(setError(errorMessage));
            return false
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handleSetSelectedTopic(topic) {
        dispatch(setSelectedTopic(topic));
    }

    return { handleGetTopics, handleGetTopicsByCategory, handleGetQuestions, handleSetSelectedTopic };
}