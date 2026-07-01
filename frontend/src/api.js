import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Create Axios Instance
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies automatically
});

// Interceptor to inject JWT token automatically from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to extract clean error message from Axios errors
const handleAxiosError = (error) => {
  const message = error.response?.data?.message || error.message || "An unexpected error occurred";
  throw new Error(message);
};

// Check Server Connection
export const checkServerStatus = async () => {
  try {
    const response = await API.get("/");
    return response.data;
  } catch (error) {
    console.error("Error connecting to backend:", error);
    handleAxiosError(error);
  }
};

// Auth: Register
export const registerUser = async (firstName, lastName, email, password) => {
  try {
    const response = await API.post("/api/auth/register", {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Auth: Login
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Auth: Logout
export const logoutUser = async () => {
  try {
    const response = await API.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Profile: Get Details
export const getUserProfile = async () => {
  try {
    const response = await API.get("/api/users/profile");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Profile: Update Details
export const updateUserProfile = async (profileData) => {
  try {
    const response = await API.put("/api/users/profile", profileData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Profile: Delete Account
export const deleteUserProfile = async () => {
  try {
    const response = await API.delete("/api/users/profile");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
export default API;
