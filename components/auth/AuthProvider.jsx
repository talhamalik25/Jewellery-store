"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const refreshUser = useCallback(async () => {
    setError("");
    try {
      const result = await apiFetch("/api/auth/me", { cache: "no-store" });
      setUser(result.user);
      setStatus("authenticated");
      return result.user;
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setUser(null);
        setStatus("unauthenticated");
        return null;
      }
      setError(requestError.message || "Unable to check your sign-in status.");
      setUser(null);
      setStatus("unauthenticated");
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiFetch("/api/auth/me", { cache: "no-store" })
      .then((result) => {
        if (!active) return;
        setUser(result.user);
        setStatus("authenticated");
      })
      .catch((requestError) => {
        if (!active) return;
        if (!(requestError instanceof ApiError && requestError.status === 401)) {
          setError(requestError.message || "Unable to check your sign-in status.");
        }
        setUser(null);
        setStatus("unauthenticated");
      });
    return () => { active = false; };
  }, []);

  const login = useCallback(async (credentials) => {
    setError("");
    const result = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    setUser(result.user);
    setStatus("authenticated");
    return result.user;
  }, []);

  const register = useCallback(async (details) => {
    setError("");
    const result = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(details),
    });
    // Registration does not set the backend's auth cookie; login is still required.
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    throw new ApiError(
      "Sign out is unavailable because the backend does not expose a logout endpoint.",
      501,
    );
  }, []);

  const value = useMemo(() => ({
    user,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    error,
    login,
    logout,
    register,
    refreshUser,
  }), [user, status, error, login, logout, register, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
