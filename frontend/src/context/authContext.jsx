import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    // true until the first /me call finishes, so ProtectedRoute does not
    // bounce a logged-in user to /login while the session is being checked.
    const [loading, setLoading] = useState(true);

    // Restore the session after a page refresh (the cookie lives in the browser,
    // the user data lives on the server).
    useEffect(() => {
        let cancelled = false;

        api.get("/me")
            .then((res) => {
                if (!cancelled) setUser(res.data.user);
            })
            .catch(() => {
                if (!cancelled) setUser(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/login", { email, password });
        setUser(response.data.user);
        return response.data.user;
    };

    const register = async (fname, lname, email, password) => {
        const response = await api.post("/register", {
            fname,
            lname,
            email,
            password,
        });
        return response.data.user;
    };

    const logout = async () => {
        try {
            await api.post("/logout");
        } catch {
            // Even if the server call fails (expired session, offline),
            // the user should still be logged out in the UI.
        } finally {
            setUser(null);
        }
    };

    const isAdmin = user?.role === "admin";
    const isCitizen = user?.role === "citizen";

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAdmin,
                isCitizen,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}