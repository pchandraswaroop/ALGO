import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user auth status
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await getUserProfile();
          if (res.success) {
            setUser(res.user);
          } else {
            // Invalid token
            handleLocalLogout();
          }
        } catch (err) {
          console.error("Auth check failed:", err.message);
          handleLocalLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const handleLocalLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);
      if (res.success) {
        localStorage.setItem("token", res.token);
        setToken(res.token);
        setUser(res.user);
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  const register = async (firstName, lastName, email, password) => {
    try {
      const res = await registerUser(firstName, lastName, email, password);
      if (res.success) {
        localStorage.setItem("token", res.token);
        setToken(res.token);
        setUser(res.user);
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Logout request failed, cleaning up local storage anyway:", err.message);
    } finally {
      handleLocalLogout();
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await updateUserProfile(profileData);
      if (res.success) {
        setUser(res.user);
      }
      return res;
    } catch (err) {
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await deleteUserProfile();
      handleLocalLogout();
      return res;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
