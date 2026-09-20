import { Navigate, useLocation } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import { useAuth } from "./auth/AuthContext";
import { ROLES } from "./auth/currentUser";

// Which entire route tree mounts is decided by auth state + role, not URL
// prefix — this is what lets both trees use clean, non-prefixed resource
// URLs (e.g. "/dashboard", "/settings") without colliding. Unauthenticated
// visitors only ever see AuthRoutes, whatever path they request.
export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <AuthRoutes />;

  if (location.pathname === "/login" || location.pathname === "/forgot-password") {
    return <Navigate to="/dashboard" replace />;
  }

  return user.role === ROLES.CLIENT ? <ClientRoutes /> : <AppRoutes />;
}
