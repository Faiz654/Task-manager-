
import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "./DashboardLayout";
import DashboardHome from "./DashboardHome";
import Tasks from "./Tasks";
import Profile from "./Profile";

function DashboardRoutes() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route
        path="/user-dashboard"
        element={<DashboardLayout />}
      >
        <Route index element={<DashboardHome />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/user-dashboard" replace />}
      />
    </Routes>
  );
}

export default DashboardRoutes;
