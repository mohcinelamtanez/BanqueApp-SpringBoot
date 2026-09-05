import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, Button, Card, LoadingState } from "../components/ui";
import LoanForm from "../components/loans/LoanForm";
import { useClients } from "../hooks/useClients";
import { useLoan } from "../hooks/useLoans";
import { loanService } from "../services/loanService";
import { PageHeading } from "./pageShared";

const FORM_ID = "loan-page-form";

export default function EditLoanPage() {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const editing = Boolean(loanId);
  const { loading: loanLoading, data: loan } = useLoan(editing ? loanId : null);
  const { loading: clientsLoading, data: clients = [] } = useClients();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if ((editing && loanLoading) || clientsLoading) return <LoadingState />;

  const save = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      if (editing) await loanService.update(loanId, values);
      else await loanService.create(values);
      navigate("/loans");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Loans", to: "/loans" },
          { label: editing ? "Edit loan" : "Add loan" },
        ]}
      />
      <PageHeading
        title={editing ? "Edit Loan" : "Add Loan"}
        subtitle="Enter the loan details."
      />
      <Card className="form-card">
        <LoanForm formId={FORM_ID} loan={loan} clients={clients} onSubmit={save} />
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" form={FORM_ID} disabled={submitting}>
            {editing ? "Save changes" : "Create loan"}
          </Button>
        </div>
      </Card>
    </>
  );
}
