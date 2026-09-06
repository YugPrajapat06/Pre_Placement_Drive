import { useDispatch, useSelector } from "react-redux";
import { getCandidateProfile, registerCandidate, updateActiveResume } from "../services/candidate.api.js";
import { setError, setLoading, setProfile, setProfileStatus } from "../slices/candidate.slice.js";
import { setActiveResume } from '../../resume/slices/resume.slice.js'

export function useCandidate() {
  const dispatch = useDispatch();
  const candidate = useSelector((state) => state.candidate);

  async function handleGetCandidateProfile() {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await getCandidateProfile();
      console.log('candidate data check : ',data);
      
      dispatch(setProfile(data.candidate));
      // dispatch(setActiveResume(data.candidate.activeResumeId));
      dispatch(setProfileStatus("succeeded"));
      return { success: true };
    } catch (error) {
      const notFound = error.response?.status === 404;
      dispatch(setProfile(null));
      dispatch(setProfileStatus(notFound ? "not-found" : "failed"));
      dispatch(setError(error.response?.data?.message || "Unable to verify candidate profile."));
      return { success: false, notFound };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleRegisterCandidate(data) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await registerCandidate(data);
      dispatch(setProfile(response.candidate));
      dispatch(setProfileStatus("succeeded"));
      return true;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Unable to create your candidate profile."));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleUpdateActiveResume(resumeId) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await updateActiveResume(resumeId);
      dispatch(setProfile(response.candidate));
      dispatch(setProfileStatus("succeeded"));
      dispatch(setActiveResume(response.activeResume));
      return true;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Unable to update your active resume."));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    ...candidate,
    handleGetCandidateProfile,
    handleRegisterCandidate,
    handleUpdateActiveResume
  };
}