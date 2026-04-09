import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../api/authApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await getMe();
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  function login(token, userData) {
    localStorage.setItem("token", token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}