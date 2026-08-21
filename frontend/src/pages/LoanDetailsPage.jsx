import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  LoadingState,
} from "../components/ui";
import { useLoan } from "../hooks/useLoans";
import { money, loanSummary } from "../utils/finance";
import { getClient, PageHeading, StatusBadge } from "./pageShared";
export default function LoanDetailsPage() {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const { loading, data: loan } = useLoan(loanId);
  if (loading) return <LoadingState />;
  if (!loan) return <EmptyState title="Loan not found" />;
  const client = getClient(loan.clientId);
  const summary = loanSummary(loan.amount, loan.duration, loan.rate);
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Loans", to: "/loans" }, { label: loan.id }]}
      />
      <PageHeading
        title={`Loan ${loan.id}`}
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
            <dd>{client?.name}</dd>
            <dt>Principal amount</dt>
            <dd>{money(loan.amount)}</dd>
            <dt>Annual interest rate</dt>
            <dd>{loan.rate}%</dd>
            <dt>Duration</dt>
            <dd>{loan.duration} months</dd>
            <dt>Risk</dt>
            <dd>
              <StatusBadge value={loan.risk} risk />
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
