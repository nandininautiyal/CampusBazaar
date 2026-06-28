import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { setAuthToken } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("auth_token");
    const storedUser = sessionStorage.getItem("auth_user");
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsed);
        setAuthToken(storedToken);
      } catch {
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newUser, newToken) => {
    setUser(newUser);
    setToken(newToken);
    sessionStorage.setItem("auth_token", newToken);
    sessionStorage.setItem("auth_user", JSON.stringify(newUser));
    setAuthToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_user");
    setAuthToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};