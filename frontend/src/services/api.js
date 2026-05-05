import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // your FastAPI backend
});

export const getOverallStats = () => API.get("/analytics/overall-stats");
export const getWeakTopics = () => API.get("/analytics/weak-topics");
export const getStrongTopics = () => API.get("/analytics/strong-topics");
export const getRecommendations = () => API.get("/analytics/recommendations");
