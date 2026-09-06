import { useEffect, useState } from "react";
import { CheckCircle2, CircleDot, XCircle } from "lucide-react";
import { Card, EmptyState, ErrorState, LoadingState } from "../../components/ui";
import { loanService } from "../../services/loanService";
import { paymentService } from "../../services/paymentService";
import { money, date, loanEndDate } from "../../utils/finance";
import { repaymentProgress } from "../../utils/paymentSchedule";
import { PageHeading } from "../pageShared";

// Display-order only — the underlying Loan.status values are untouched.
// Active loans are the client's most relevant/ongoing obligation, so they
// always lead, then Completed, then Rejected (kept for traceability only).
const STATUS_PRIORITY = { Active: 0, Completed: 1, Rejected: 2 };
const STATUS_META = {
  Active: { icon: CircleDot, tone: "active" },
  Completed: { icon: CheckCircle2, tone: "completed" },
  Rejected: { icon: XCircle, tone: "rejected" },
};

export default function ClientLoansPage() {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    // Payments are fetched alongside Loans purely to compute each ACTIVE
    // loan's real repayment progress below — nothing here changes what
    // "My Payments" itself does.
    Promise.all([loanService.listMine(), paymentService.listMine()])
      .then(([loanData, paymentData]) => {
        if (active) {
          setLoans(loanData);
          setPayments(paymentData);
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

  // Stable sort — loans sharing a status keep the order the backend
  // returned them in (no date field is reordered/invented here).
  const sortedLoans = [...loans].sort(
    (a, b) => (STATUS_PRIORITY[a.status] ?? 99) - (STATUS_PRIORITY[b.status] ?? 99),
  );

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
          {sortedLoans.map((loan) => {
            const rejected = loan.status === "Rejected";
            const endDate = rejected
              ? null
              : loanEndDate(loan.startDate, loan.duration);
            const meta = STATUS_META[loan.status];
            const StatusIcon = meta?.icon;

            // Real repayment progress — the exact Payment rows scheduled
            // for this loan, never a derived/estimated figure. A Rejected
            // loan never gets a schedule at all (see LoanServiceImpl), so
            // this is naturally only ever meaningful for Active. Shared
            // with the Dashboard (see utils/paymentSchedule.js).
            const loanPayments = payments.filter((p) => p.loanId === loan.id);
            const { paidCount, totalCount, percent: progressPct } =
              repaymentProgress(loanPayments);

            return (
              <Card
                key={loan.id}
                className={loan.status === "Active" ? "loan-card-active" : ""}
              >
                <div className="section-head">
                  <div>
                    <h3>{loan.type}</h3>
                    <span className="mono loan-card-reference">
                      {loan.reference}
                    </span>
                  </div>
                  <span className={`loan-status-pill ${meta?.tone || ""}`}>
                    {StatusIcon && <StatusIcon size={14} />}
                    {loan.status}
                  </span>
                </div>

                {/* A Rejected loan never has a real monthly payment (it
                    never reaches repayment) — nothing to highlight here in
                    that case, keeping the card concise per its status. */}
                {!rejected && loan.monthlyPayment != null && (
                  <div className="loan-card-summary">
                    <div className="stat-mini stat-mini-payment">
                      <small>Monthly Payment</small>
                      <strong>{money(loan.monthlyPayment)}</strong>
                    </div>
                    <span className="loan-card-date">
                      Start Date: {date(loan.startDate)}
                    </span>
                  </div>
                )}

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
                  {rejected ? (
                    <div className="stat-mini">
                      <small>Start date</small>
                      <strong>{date(loan.startDate)}</strong>
                    </div>
                  ) : (
                    <div className="stat-mini">
                      <small>End date</small>
                      <strong>{endDate ? date(endDate) : "—"}</strong>
                    </div>
                  )}
                </div>

                {loan.status === "Active" && (
                  <div className="loan-progress">
                    <small>Repayment Progress</small>
                    <div className="progress">
                      <i style={{ width: `${progressPct}%` }} />
                    </div>
                    <p>
                      {progressPct}% · {paidCount} / {totalCount} payments paid
                    </p>
                  </div>
                )}

                {rejected && (
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
