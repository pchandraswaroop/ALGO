const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const checkServerStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error connecting to backend:", error);
    throw error;
  }
};
