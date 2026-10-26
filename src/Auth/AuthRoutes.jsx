
import { Routes, Route } from "react-router-dom";

import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/ResetPassword";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />
    </Routes>
  );
}

export default AuthRoutes;
