import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until first checkSession resolves

  const loggedIn = user !== null;
  const isAdmin = user?.role === "admin";

  // Asks PHP "is there a valid session cookie?" (runs on first load / refresh)
  const checkSession = async () => {
    try {
      const { data } = await api.get("checkSession.php");
      setUser(data.loggedIn ? data.user : null);
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Always clears the local user; returns the server's message for display.
  const logout = async () => {
    let message = "Logged out.";
    try {
      const { data } = await api.post("logout.php");
      message = data?.message || message;
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
    return message;
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, loggedIn, isAdmin, loading, logout, checkSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};