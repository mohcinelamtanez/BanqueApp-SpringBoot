import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import DashboardPage from "../pages/DashboardPage";
import ClientsPage from "../pages/ClientsPage";
import ClientDetailsPage from "../pages/ClientDetailsPage";
import AddClientPage from "../pages/AddClientPage";
import EditClientPage from "../pages/EditClientPage";
import LoansPage from "../pages/LoansPage";
import LoanDetailsPage from "../pages/LoanDetailsPage";
import AddLoanPage from "../pages/AddLoanPage";
import EditLoanPage from "../pages/EditLoanPage";
import PaymentHistoryPage from "../pages/PaymentHistoryPage";
import ReportsPage from "../pages/ReportsPage";
import SecurityPage from "../pages/SecurityPage";
import SettingsPage from "../pages/SettingsPage";
import { EmptyState } from "../components/ui";
const NotFound = () => (
  <EmptyState
    title="Page not found"
    detail="Use the sidebar to return to BanqueApp administration."
  />
);
export default function AppRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/new" element={<AddClientPage />} />
        <Route path="/clients/:clientId" element={<ClientDetailsPage />} />
        <Route path="/clients/:clientId/edit" element={<EditClientPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/loans/new" element={<AddLoanPage />} />
        <Route path="/loans/:loanId" element={<LoanDetailsPage />} />
        <Route path="/loans/:loanId/edit" element={<EditLoanPage />} />
        <Route
          path="/loans/:loanId/payments"
          element={<PaymentHistoryPage />}
        />
        <Route
          path="/clients/:clientId/loans/:loanId"
          element={<LoanDetailsPage />}
        />
        <Route
          path="/clients/:clientId/loans/:loanId/payments"
          element={<PaymentHistoryPage />}
        />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminLayout>
  );
}
