import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

/*
  <ProtectedRoute>                      any logged-in user
  <ProtectedRoute adminOnly>            admins only
  <ProtectedRoute roles={["citizen"]}>  only the listed roles

  This only controls what the UI shows. The real protection is the
  `role` middleware on the Laravel routes.
*/
function ProtectedRoute({ children, adminOnly = false, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center font-medium text-gray-500">Loading...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;

  const allowed = adminOnly ? ["admin"] : roles;

  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;