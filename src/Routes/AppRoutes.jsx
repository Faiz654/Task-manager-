
import { useLocation } from "react-router-dom";

import PagesRoutes from "../Pages/PagesRoutes";
import AuthRoutes from "../Auth/AuthRoutes";
import AdminPanelRoutes from "../admin/adminPanelRoutes";
import DashboardRoutes from "../Dashboard/DashboardRoutes";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  const { pathname } = useLocation();

  // Authentication routes
  const authPaths = [
    "/login",
    "/signup",
    "/forgot-password",
  ];

  // Password reset route includes the token
  const isResetPasswordPage =
    pathname.startsWith("/reset-password/");

  const isAuthPage =
    authPaths.includes(pathname) || isResetPasswordPage;

  // Admin panel routes
  const isAdminPanelPage =
    pathname.startsWith("/dashboard");

  // Normal user dashboard routes
  const isUserDashboardPage =
    pathname.startsWith("/user-dashboard");

  // Admin panel
  if (isAdminPanelPage) {
    return (
      <ProtectedRoute allowedRole="admin">
        <AdminPanelRoutes />
      </ProtectedRoute>
    );
  }

  // User dashboard
  if (isUserDashboardPage) {
    return (
      <ProtectedRoute allowedRole="user">
        <DashboardRoutes />
      </ProtectedRoute>
    );
  }

  // Login, Signup, Forgot Password, Reset Password
  if (isAuthPage) {
    return <AuthRoutes />;
  }

  // Public website pages
  return <PagesRoutes />;
}

export default AppRoutes;
