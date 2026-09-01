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
  const { page, setPage, totalPages, pageItems } = usePagination(data, 5);
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
          message={`Delete loan ${target.id}? This destructive local action cannot be undone.`}
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
