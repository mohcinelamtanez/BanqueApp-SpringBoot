import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoanTable from "../components/loans/LoanTable";
import {
  Button,
  Card,
  ConfirmationDialog,
  LoadingState,
  Pagination,
} from "../components/ui";
import { useLoans } from "../hooks/useLoans";
import { loanService } from "../services/loanService";
import { usePagination } from "../hooks/usePagination";
import { PageHeading } from "./pageShared";
export default function LoansPage() {
  const navigate = useNavigate();
  const { loading, data = [] } = useLoans();
  const [target, setTarget] = useState(null);
  // Pending loans are applications still awaiting a decision — they belong
  // exclusively in "Loan Applications" until an Admin/Bank Agent reviews
  // them; only Active/Rejected loans show up here.
  const loans = (data || []).filter((loan) => loan.status !== "Pending");
  const { page, setPage, totalPages, pageItems } = usePagination(loans, 5);
  if (loading) return <LoadingState />;
  return (
    <>
      <PageHeading
        title="Loan Management"
        subtitle="Monitor the complete loan portfolio."
        action={
          <Button onClick={() => navigate("/loans/new-loan")}>
            <Plus size={17} /> New loan
          </Button>
        }
      />
      <Card>
        <LoanTable loans={pageItems} onDelete={setTarget} />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
      {target && (
        <ConfirmationDialog
          message={`Delete loan ${target.reference}? This action cannot be undone.`}
          onClose={() => setTarget(null)}
          onConfirm={async () => {
            await loanService.remove(target.id);
            navigate("/loans");
          }}
        />
      )}
    </>
  );
}
