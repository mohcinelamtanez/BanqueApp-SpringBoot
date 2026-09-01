import { Routes, Route, Navigate } from "react-router-dom";
import ClientLayout from "../components/layout/ClientLayout";
import ClientDashboardPage from "../pages/client/ClientDashboardPage";
import ClientProfilePage from "../pages/client/ClientProfilePage";
import ClientLoansPage from "../pages/client/ClientLoansPage";
import ClientApplicationsPage from "../pages/client/ClientApplicationsPage";
import ClientPaymentsPage from "../pages/client/ClientPaymentsPage";
import ClientSettingsPage from "../pages/client/ClientSettingsPage";
import { EmptyState } from "../components/ui";
const ClientNotFound = () => (
  <EmptyState
    title="Page not found"
    detail="Use the sidebar to return to your BanqueApp client portal."
  />
);
export default function ClientRoutes() {
  return (
    <ClientLayout>
      <Routes>
        {/* Mounted at the true app root (see App.jsx) — these are real,
            resource-oriented URLs, not relative to any prefix. */}
        <Route path="/" element={<ClientDashboardPage />} />
        <Route path="/dashboard" element={<ClientDashboardPage />} />
        <Route path="/my-profile" element={<ClientProfilePage />} />
        <Route path="/my-loans" element={<ClientLoansPage />} />
        <Route path="/my-loans/:loanId" element={<ClientLoansPage />} />
        <Route path="/my-applications" element={<ClientApplicationsPage />} />
        <Route
          path="/my-applications/:applicationId"
          element={<ClientApplicationsPage />}
        />
        <Route path="/my-payments" element={<ClientPaymentsPage />} />
        <Route path="/settings" element={<ClientSettingsPage />} />
        {/* Internal banking routes must never be reachable from the Client
            portal — explicitly redirect them rather than letting them fall
            through to the generic not-found page, per the required
            role-based route protection (not just hidden nav items). */}
        <Route path="/clients/*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/loans/*" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/loan-applications/*"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route path="/users/*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/reports" element={<Navigate to="/dashboard" replace />} />
        <Route path="/security" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<ClientNotFound />} />
      </Routes>
    </ClientLayout>
  );
}
