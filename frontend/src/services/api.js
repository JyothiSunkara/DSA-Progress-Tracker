import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      alert("Session expired. Please login again.");

      window.location.href = "/";
    }

    return Promise.reject(error);
  },
);

export const getOverallStats = () => API.get("/analytics/overall-stats");

export const getWeakTopics = () => API.get("/analytics/weak-topics");

export const getStrongTopics = () => API.get("/analytics/strong-topics");

export const getRecommendations = () => API.get("/analytics/recommendations");

export default API;
