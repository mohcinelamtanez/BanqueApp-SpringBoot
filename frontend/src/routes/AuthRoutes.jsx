import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

// Mounted whenever there is no authenticated user (see App.jsx) — any path
// other than /login or /forgot-password redirects to /login, which is how
// every protected route ("/dashboard", "/clients", "/my-loans", …) ends up
// requiring authentication without each of them needing its own guard.
export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
