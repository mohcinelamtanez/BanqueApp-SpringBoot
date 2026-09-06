import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, EmptyState, LoadingState } from "../../components/ui";
import ClientAvatar from "../../components/clients/ClientAvatar";
import { useClientProfile } from "./ClientProfileContext";
import { isProfileComplete } from "../../services/clientService";
import { loanService } from "../../services/loanService";
import { applicationService } from "../../services/applicationService";
import { paymentService } from "../../services/paymentService";
import {
  buildPaymentNotifications,
  nextUpcomingPayment,
  paymentTotals,
  repaymentProgress,
} from "../../utils/paymentSchedule";
import { money, date } from "../../utils/finance";
import { Metric, PageHeading, initials } from "../pageShared";

const APPLICATION_STATUSES = ["Pending", "Approved", "Rejected"];

export default function ClientDashboardPage() {
  const { client, loading: profileLoading } = useClientProfile();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [failed, setFailed] = useState({});

  useEffect(() => {
    // No Client yet — nothing to fetch (every /me endpoint below requires
    // one); the page shows the "complete your profile" state instead.
    if (!client) {
      setLoading(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    // Independent per-section failure handling (Promise.allSettled, not
    // Promise.all) — one data source being down must not blank out the
    // whole dashboard, only the section(s) that actually depend on it.
    Promise.allSettled([
      loanService.listMine(),
      applicationService.listMine(),
      paymentService.listMine(),
    ]).then(([loanResult, applicationResult, paymentResult]) => {
      if (!active) return;
      setLoans(loanResult.status === "fulfilled" ? loanResult.value : []);
      setApplications(
        applicationResult.status === "fulfilled" ? applicationResult.value : [],
      );
      setPayments(paymentResult.status === "fulfilled" ? paymentResult.value : []);
      setFailed({
        loans: loanResult.status === "rejected",
        applications: applicationResult.status === "rejected",
        payments: paymentResult.status === "rejected",
      });
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [client]);

  if (profileLoading || loading) {
    return <LoadingState label="Loading your dashboard…" />;
  }

  if (!client) {
    return (
      <div className="client-dashboard">
        <PageHeading title="Dashboard" subtitle="Your personal banking overview." />
        <Card className="dashboard-welcome">
          <div>
            <h2>Welcome 👋</h2>
            <p>Complete your profile to see your financial overview.</p>
            <Link to="/my-profile" className="btn primary dashboard-welcome-btn">
              Complete your profile
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const activeLoan = loans.find((loan) => loan.status === "Active");
  const activeLoanPayments = activeLoan
    ? payments.filter((p) => p.loanId === activeLoan.id)
    : [];
  const { paidCount, totalCount, percent } = repaymentProgress(activeLoanPayments);
  const { totalPaid, remainingBalance } = paymentTotals(payments);
  const nextPayment = nextUpcomingPayment(payments);
  const applicationCounts = APPLICATION_STATUSES.reduce((acc, status) => {
    acc[status] = applications.filter((a) => a.status === status).length;
    return acc;
  }, {});
  // Reuses the exact same real-data-derived reminders already shown in the
  // topbar notification bell (ClientLayout) — not a new activity/audit
  // system, just the one that already exists in this app.
  const activity = buildPaymentNotifications(activeLoan, activeLoanPayments);

  return (
    <div className="client-dashboard">
      <PageHeading title="Dashboard" subtitle="Your personal banking overview." />

      <Card className="dashboard-welcome">
        <ClientAvatar
          profilePhotoUrl={client.profilePhotoUrl}
          initials={initials(client.name)}
          className="avatar dashboard-welcome-avatar"
        />
        <div>
          <h2>Welcome back, {client.firstName} 👋</h2>
          <p>Here's your financial overview.</p>
          {!isProfileComplete(client) && (
            <Link to="/my-profile" className="dashboard-welcome-cta">
              Complete your profile
            </Link>
          )}
        </div>
      </Card>

      <div className="kpis client-payments-kpis">
        <Metric
          label="Total Paid"
          value={money(totalPaid)}
          className="metric-gradient-paid"
        />
        <Metric
          label="Remaining Balance"
          value={money(remainingBalance)}
          className="metric-gradient-balance"
        />
        <Metric
          label="Next Payment"
          value={nextPayment ? money(nextPayment.amount) : "—"}
          footer={
            nextPayment
              ? `Due ${date(nextPayment.dueDate)}`
              : "No upcoming payment"
          }
          className="metric-gradient-due"
        />
      </div>

      <div className="detail-grid">
        <Card>
          <div className="section-head">
            <h2>Active Loan</h2>
            {activeLoan && (
              <Link to="/my-loans" className="decision-link-btn">
                View Loan
              </Link>
            )}
          </div>
          {failed.loans ? (
            <EmptyState
              title="Unable to load your loans"
              detail="Please try again later."
            />
          ) : activeLoan ? (
            <>
              <div className="loan-card-summary">
                <div className="stat-mini stat-mini-payment">
                  <small>Monthly Payment</small>
                  <strong>{money(activeLoan.monthlyPayment)}</strong>
                </div>
                <div className="dashboard-active-loan-facts">
                  <span className="loan-status-pill active">
                    {activeLoan.status}
                  </span>
                  <span className="mono">{money(activeLoan.amount)}</span>
                </div>
              </div>
              {totalCount > 0 && (
                <div className="loan-progress">
                  <small>Repayment Progress</small>
                  <div className="progress">
                    <i style={{ width: `${percent}%` }} />
                  </div>
                  <p>
                    {percent}% · {paidCount} / {totalCount} payments paid
                  </p>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No active loan"
              detail="Approved loan applications will appear here once activated."
            />
          )}
        </Card>

        <Card>
          <div className="section-head">
            <h2>Applications</h2>
            <Link to="/my-applications" className="decision-link-btn">
              View Applications
            </Link>
          </div>
          {failed.applications ? (
            <EmptyState
              title="Unable to load your applications"
              detail="Please try again later."
            />
          ) : applications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              detail="Submit a loan application to see it summarized here."
            />
          ) : (
            <div className="stat-grid-3">
              {APPLICATION_STATUSES.map((status) => (
                <div className="stat-mini center" key={status}>
                  <small>{status}</small>
                  <strong>{applicationCounts[status]}</strong>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <h2>Recent Activity</h2>
        {failed.loans || failed.payments ? (
          <EmptyState
            title="Unable to load recent activity"
            detail="Please try again later."
          />
        ) : activity.length === 0 ? (
          <EmptyState
            title="No recent activity"
            detail="You're all caught up — nothing needs your attention right now."
          />
        ) : (
          <div className="dashboard-activity-list">
            {activity.map((item) => (
              <div className="dashboard-activity-item" key={item.id}>
                <span className={item.unread ? "dot" : ""} />
                <div>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                  <small>{item.time}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
