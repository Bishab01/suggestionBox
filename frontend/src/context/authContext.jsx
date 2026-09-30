import { createContext, useContext, useEffect, useState } from "react";
import api, { getCsrfCookie } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On load, ask the server who we are. The session cookie (if any) is sent
  // automatically; a 401 simply means "guest".
  useEffect(() => {
    api
      .get("/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    await getCsrfCookie();
    const res = await api.post("/login", { email, password });
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (fname, lname, email, password) => {
    await getCsrfCookie();
    const res = await api.post("/register", {
      fname,
      lname,
      email,
      password,
      password_confirmation: password,
    });
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      // ignore network errors on logout
    }
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
