import { Badge, Card, EmptyState, LoadingState } from "../../components/ui";
import { useLoans } from "../../hooks/useLoans";
import { money, date } from "../../utils/finance";
import { PageHeading } from "../pageShared";
import { CURRENT_CLIENT_ID } from "./clientShared";

export default function ClientLoansPage() {
  const { loading, data: loans } = useLoans();

  if (loading) return <LoadingState label="Loading your loans…" />;

  const myLoans = (loans || []).filter(
    (loan) =>
      loan.clientId === CURRENT_CLIENT_ID &&
      (loan.status === "Active" || loan.status === "Completed"),
  );

  return (
    <>
      <PageHeading
        title="My Loans"
        subtitle="Track your active and past loans."
      />
      {myLoans.length === 0 ? (
        <Card>
          <EmptyState
            title="No loans yet"
            detail="Approved loan applications will appear here once your loan is activated."
          />
        </Card>
      ) : (
        <div className="stack-gap">
          {myLoans.map((loan) => (
            <Card key={loan.id}>
              <div className="section-head">
                <div>
                  <h3>{loan.type}</h3>
                  <span className="mono">{loan.id}</span>
                </div>
                <Badge type={loan.status.toLowerCase()}>{loan.status}</Badge>
              </div>
              <div className="stat-grid-4">
                <div className="stat-mini">
                  <small>Amount</small>
                  <strong>{money(loan.amount)}</strong>
                </div>
                <div className="stat-mini">
                  <small>Duration</small>
                  <strong>{loan.duration} months</strong>
                </div>
                <div className="stat-mini">
                  <small>Started</small>
                  <strong>{date(loan.startDate)}</strong>
                </div>
                <div className="stat-mini">
                  <small>
                    {loan.status === "Active" ? "Outstanding" : "Ended"}
                  </small>
                  <strong>
                    {loan.status === "Active"
                      ? money(loan.amount - loan.repaid)
                      : date(loan.endDate)}
                  </strong>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
