import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://asset-backend-hbyq.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getUsers: () => api.get("/auth/users"),
};

// Asset endpoints
export const assetAPI = {
  getAllAssets: (params) => api.get("/assets", { params }),
  createAsset: (assetData) => api.post("/assets", assetData),
  updateAsset: (id, assetData) => api.put(`/assets/${id}`, assetData),
  deleteAsset: (id) => api.delete(`/assets/${id}`),
  getAssetStats: () => api.get("/assets/stats"),
  getRecentAssets: () => api.get("/assets/recent"),
};

// Assignment endpoints
export const assignmentAPI = {
  createAssignment: (data) => api.post("/assignments", data),
  getAllAssignments: () => api.get("/assignments"),
  returnAsset: (assignmentId, remarks) =>
    api.post(`/assignments/${assignmentId}/return`, { remarks }),
};

// History endpoints
export const historyAPI = {
  getMonthlyActivityData: () => api.get("/history/activity/monthly"),
};

export default api;
