import { useState, useEffect } from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
} from "../api";
import { AuthContext } from "./AuthContextCore";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const handleLocalLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

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

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    if (res.success) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (firstName, lastName, email, password) => {
    const res = await registerUser(firstName, lastName, email, password);
    if (res.success) {
      localStorage.setItem("token", res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
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
    const res = await updateUserProfile(profileData);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  const deleteAccount = async () => {
    const res = await deleteUserProfile();
    handleLocalLogout();
    return res;
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
