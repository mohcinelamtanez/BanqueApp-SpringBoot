import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import DashboardPage from "../pages/DashboardPage";
import UserManagementPage from "../pages/UserManagementPage";
import { isAdmin } from "../auth/currentUser";
import ClientsPage from "../pages/ClientsPage";
import ClientDetailsPage from "../pages/ClientDetailsPage";
import AddClientPage from "../pages/AddClientPage";
import EditClientPage from "../pages/EditClientPage";
import LoansPage from "../pages/LoansPage";
import LoanRequestsPage from "../pages/LoanRequestsPage";
import LoanRequestReviewPage from "../pages/LoanRequestReviewPage";
import LoanDetailsPage from "../pages/LoanDetailsPage";
import AddLoanPage from "../pages/AddLoanPage";
import NewLoanAssessmentPage from "../pages/NewLoanAssessmentPage";
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
        <Route path="/clients/new-client" element={<AddClientPage />} />
        <Route path="/clients/:clientId" element={<ClientDetailsPage />} />
        <Route path="/clients/:clientId/edit" element={<EditClientPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/loan-applications" element={<LoanRequestsPage />} />
        <Route
          path="/loan-applications/:applicationId"
          element={<LoanRequestReviewPage />}
        />
        <Route path="/loans/add" element={<AddLoanPage />} />
        <Route path="/loans/new-loan" element={<NewLoanAssessmentPage />} />
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
        <Route
          path="/users"
          element={
            isAdmin() ? <UserManagementPage /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route
          path="/users/:userId"
          element={
            isAdmin() ? <UserManagementPage /> : <Navigate to="/dashboard" replace />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AdminLayout>
  );
}
