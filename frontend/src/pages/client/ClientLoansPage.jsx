import { useEffect, useState } from "react";
import { Card, EmptyState, ErrorState, LoadingState } from "../../components/ui";
import { loanService } from "../../services/loanService";
import { money, date, loanEndDate } from "../../utils/finance";
import { PageHeading, StatusBadge } from "../pageShared";

export default function ClientLoansPage() {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    loanService
      .listMine()
      .then((data) => {
        if (active) {
          setLoans(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("Unable to load your loans right now. Please try again.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) return <LoadingState label="Loading your loans…" />;
  if (error) return <ErrorState detail={error} />;

  return (
    <>
      <PageHeading
        title="My Loans"
        subtitle="Track your active, completed and rejected loans."
      />
      {loans.length === 0 ? (
        <Card>
          <EmptyState
            title="No loans yet"
            detail="Approved loan applications will appear here once your loan is activated."
          />
        </Card>
      ) : (
        <div className="stack-gap">
          {loans.map((loan) => {
            const endDate =
              loan.status === "Rejected"
                ? null
                : loanEndDate(loan.startDate, loan.duration);
            return (
              <Card key={loan.id}>
                <div className="section-head">
                  <div>
                    <h3>{loan.type}</h3>
                    <span className="mono">{loan.reference}</span>
                  </div>
                  <StatusBadge value={loan.status} />
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
                    <small>Interest rate</small>
                    <strong>{loan.rate}%</strong>
                  </div>
                  <div className="stat-mini">
                    <small>Monthly payment</small>
                    <strong>
                      {loan.monthlyPayment != null ? money(loan.monthlyPayment) : "—"}
                    </strong>
                  </div>
                  <div className="stat-mini">
                    <small>Risk</small>
                    <strong>
                      {loan.risk ? <StatusBadge value={loan.risk} risk /> : "—"}
                    </strong>
                  </div>
                  <div className="stat-mini">
                    <small>Start date</small>
                    <strong>{date(loan.startDate)}</strong>
                  </div>
                  <div className="stat-mini">
                    <small>End date</small>
                    <strong>{endDate ? date(endDate) : "—"}</strong>
                  </div>
                  <div className="stat-mini">
                    <small>{loan.status === "Active" ? "Outstanding" : "Status"}</small>
                    <strong>
                      {loan.status === "Active"
                        ? money(loan.amount - loan.repaid)
                        : loan.status}
                    </strong>
                  </div>
                </div>
                {loan.status === "Rejected" && (
                  <p className="application-decision-reason">
                    <span>Rejection reason: </span>
                    {loan.rejectionReason || "No rejection reason was provided."}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
