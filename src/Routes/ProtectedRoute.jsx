import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRole, children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  // Check login
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Check user role
  if (allowedRole && user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "admin" ? "/dashboard" : "/user-dashboard"}
        replace
      />
    );
  }

  // Authorized user
  return children;
}

export default ProtectedRoute;