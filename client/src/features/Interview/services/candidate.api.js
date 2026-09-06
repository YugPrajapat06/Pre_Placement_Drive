import axios from "axios";

const api = axios.create({
  baseURL: "/api/candidate",
  withCredentials: true,
});

export async function getCandidateProfile() {
  const res = await api.get("/profile");
  return res.data;
}

export async function registerCandidate(data) {
  const res = await api.post("/register", data);
  return res.data;
}

export async function updateActiveResume(resumeId) {
  const res = await api.patch(`/update/active-resume/${resumeId}`);
  return res.data;
}