import { Routes, Route } from "react-router-dom";
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
        {/* Relative to the "/client" prefix already matched by the outer
            <Route path="/client/*"> in App.jsx — NOT absolute paths. */}
        <Route path="/" element={<ClientDashboardPage />} />
        <Route path="/dashboard" element={<ClientDashboardPage />} />
        <Route path="/profile" element={<ClientProfilePage />} />
        <Route path="/loans" element={<ClientLoansPage />} />
        <Route path="/applications" element={<ClientApplicationsPage />} />
        <Route path="/payments" element={<ClientPaymentsPage />} />
        <Route path="/settings" element={<ClientSettingsPage />} />
        <Route path="*" element={<ClientNotFound />} />
      </Routes>
    </ClientLayout>
  );
}
