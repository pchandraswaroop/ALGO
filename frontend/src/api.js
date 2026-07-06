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
  },
);

// Helper to extract clean error message from Axios errors
const handleAxiosError = (error) => {
  const message =
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred";
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

// Problems: List all problems
export const getProblems = async () => {
  try {
    const response = await API.get("/api/problems");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Problems: Get statistics
export const getProblemsStats = async () => {
  try {
    const response = await API.get("/api/problems/stats");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Problems: Get single problem detail
export const getProblemById = async (problemId) => {
  try {
    const response = await API.get(`/api/problems/${problemId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Submissions: Create a new submission
export const createSubmission = async (submissionData) => {
  try {
    const response = await API.post("/api/submissions", submissionData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Submissions: Run code immediately with custom input
export const runCustomCode = async (runData) => {
  try {
    const response = await API.post("/api/custom-run", runData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Submissions: Get current user's submissions
export const getUserSubmissions = async () => {
  try {
    const response = await API.get("/api/submissions");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Submissions: Get a single submission
export const getSubmissionById = async (submissionId) => {
  try {
    const response = await API.get(`/api/submissions/${submissionId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Admin: Users
export const getAdminUsers = async () => {
  try {
    const response = await API.get("/api/admin/users");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const deleteAdminUser = async (userId) => {
  try {
    const response = await API.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Admin: Problems
export const getAdminProblems = async () => {
  try {
    const response = await API.get("/api/admin/problems");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const createAdminProblem = async (problemData) => {
  try {
    const response = await API.post("/api/admin/problems", problemData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateAdminProblem = async (problemId, problemData) => {
  try {
    const response = await API.put(
      `/api/admin/problems/${problemId}`,
      problemData,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const deleteAdminProblem = async (problemId) => {
  try {
    const response = await API.delete(`/api/admin/problems/${problemId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Admin: Problem Test Cases
export const getAdminProblemTestCases = async (problemId) => {
  try {
    const response = await API.get(
      `/api/admin/problems/${problemId}/testcases`,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const createAdminTestCase = async (problemId, testCaseData) => {
  try {
    const response = await API.post(
      `/api/admin/problems/${problemId}/testcases`,
      testCaseData,
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const deleteAdminTestCase = async (testCaseId) => {
  try {
    const response = await API.delete(`/api/admin/testcases/${testCaseId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export default API;
