import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

// Shown briefly while checkSession() is still resolving (e.g. on page refresh)
export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex h-full w-full items-center justify-center bg-white/30 backdrop-blur-md">
      <div className="size-8 rounded-full border-2 border-[#023166] border-t-transparent animate-spin" />
    </div>
  );
}

// Requires a logged-in user. With `adminOnly`, citizens are sent back to /home.
// Used in appRoutes.jsx as: <ProtectedRoute adminOnly><Outlet /></ProtectedRoute>
function ProtectedRoute({ children, adminOnly = false }) {
  const { loggedIn, isAdmin, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!loggedIn) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/home" replace />;

  return children;
}

export default ProtectedRoute;
