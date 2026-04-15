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
  getUserById: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, userData) => api.put(`/auth/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

// Asset endpoints
export const assetAPI = {
  getAllAssets: (params) => api.get("/assets", { params }),
  getAssetById: (id) => api.get(`/assets/${id}`),
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
  getAssignmentById: (id) => api.get(`/assignments/${id}`),
  returnAsset: (assignmentId, remarks) =>
    api.post(`/assignments/${assignmentId}/return`, { remarks }),
  transferAsset: (data) => api.post("/assignments/transfer", data),
  getUserAssets: (userId) => api.get(`/assignments/user/${userId}`),
  getAssignmentHistory: (assetId) => api.get(`/assignments/history/${assetId}`),
};

// History endpoints
export const historyAPI = {
  getAssetHistory: (assetId) => api.get(`/history/asset/${assetId}`),
  getAllHistory: (params) => api.get("/history", { params }),
  getRecentActivity: (params) =>
    api.get("/history/activity/recent", { params }),
  getMonthlyActivityData: () => api.get("/history/activity/monthly"),
};

export default api;
