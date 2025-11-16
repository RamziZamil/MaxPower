import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Configure axios to always include credentials
axios.defaults.withCredentials = true;

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize axios headers from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(
            "http://localhost:5000/api/users/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );

          if (response.data && response.data.data && response.data.data.user) {
            setUser(response.data.data.user);
            setIsAuthenticated(true);
          } else {
            // Clear invalid token
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        // Clear invalid token
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (token) => {
    try {
      // Store token in localStorage
      localStorage.setItem("token", token);

      // Set the Authorization header for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch user profile
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (!response.data || !response.data.data || !response.data.data.user) {
        throw new Error("No user data received");
      }

      // Update state
      setUser(response.data.data.user);
      setIsAuthenticated(true);

      // Return the user data
      return response.data.data.user;
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      // Clear token on error
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call the logout endpoint to clear the cookie
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
