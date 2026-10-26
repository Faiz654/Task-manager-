
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminTasks from "./AdminTasks";

function AdminPanelRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<AdminLayout />}>
        {/* Default Admin Dashboard */}
        <Route index element={<AdminDashboard />} />

        {/* Users Management */}
        <Route path="users" element={<AdminUsers />} />

        {/* Tasks Management */}
        <Route path="tasks" element={<AdminTasks />} />

        {/* Redirect invalid admin URLs */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Route>
    </Routes>
  );
}

export default AdminPanelRoutes;
