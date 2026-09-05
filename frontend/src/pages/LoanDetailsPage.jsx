import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  LoadingState,
} from "../components/ui";
import { useLoan } from "../hooks/useLoans";
import { useClient } from "../hooks/useClients";
import { money, loanSummary, loanEndDate } from "../utils/finance";
import { PageHeading, StatusBadge } from "./pageShared";
export default function LoanDetailsPage() {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const { loading: loanLoading, data: loan } = useLoan(loanId);
  const { loading: clientLoading, data: client } = useClient(
    loan?.clientId,
  );
  if (loanLoading || (loan?.clientId && clientLoading)) return <LoadingState />;
  if (!loan) return <EmptyState title="Loan not found" />;
  const summary = loanSummary(loan.amount, loan.duration, loan.rate);
  // A Rejected loan never had a repayment period, so it has no End Date.
  const endDate =
    loan.status === "Rejected"
      ? null
      : loanEndDate(loan.startDate, loan.duration);
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Loans", to: "/loans" }, { label: loan.reference }]}
      />
      <PageHeading
        title={`Loan ${loan.reference}`}
        subtitle={`${loan.type} for ${client?.name || "unknown client"}`}
        action={
          <div className="actions">
            <Button
              variant="secondary"
              onClick={() => navigate(`/loans/${loan.id}/payments`)}
            >
              Payment history
            </Button>
            <Button onClick={() => navigate(`/loans/${loan.id}/edit`)}>
              Edit loan
            </Button>
          </div>
        }
      />
      <div className="detail-grid">
        <Card>
          <h2>Loan information</h2>
          <dl>
            <dt>Client</dt>
            <dd>{client?.name || "—"}</dd>
            <dt>Principal amount</dt>
            <dd>{money(loan.amount)}</dd>
            <dt>Annual interest rate</dt>
            <dd>{loan.rate}%</dd>
            <dt>Duration</dt>
            <dd>{loan.duration} months</dd>
            <dt>Start Date</dt>
            <dd>{loan.startDate || "—"}</dd>
            <dt>End Date</dt>
            <dd>{endDate || "—"}</dd>
            <dt>Risk</dt>
            <dd>
              {loan.risk ? <StatusBadge value={loan.risk} risk /> : "—"}
            </dd>
            <dt>Status</dt>
            <dd>
              <StatusBadge value={loan.status} />
            </dd>
          </dl>
        </Card>
        <Card>
          <h2>Financial summary</h2>
          <dl>
            <dt>Monthly payment</dt>
            <dd>{money(summary.monthlyPayment)}</dd>
            <dt>Estimated interest</dt>
            <dd>{money(summary.estimatedInterest)}</dd>
            <dt>Total repayment</dt>
            <dd>{money(summary.totalRepayment)}</dd>
          </dl>
        </Card>
      </div>
    </>
  );
}
