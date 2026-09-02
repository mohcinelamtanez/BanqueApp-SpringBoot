import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  LoadingState,
  Pagination,
  Select,
} from "../../components/ui";
import PaymentDetailsModal from "../../components/payments/PaymentDetailsModal";
import PaymentScheduleModal from "../../components/payments/PaymentScheduleModal";
import { loanService } from "../../services/loanService";
import { paymentService } from "../../services/paymentService";
import { usePagination } from "../../hooks/usePagination";
import { money, date } from "../../utils/finance";
import { amountDue, visiblePaymentRows } from "../../utils/paymentSchedule";
import { loanStats, Metric, PageHeading } from "../pageShared";
import { CURRENT_CLIENT_ID, PAYMENT_STATUS_LABEL } from "./clientShared";

export default function ClientPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loanService.list().then(async (allLoans) => {
      const myLoans = allLoans.filter(
        (loan) => loan.clientId === CURRENT_CLIENT_ID,
      );
      const paymentLists = await Promise.all(
        myLoans.map((loan) => paymentService.list(loan.id)),
      );
      if (!active) return;
      setLoans(myLoans);
      setPayments(paymentLists.flat());
      // MVP assumption: a client has at most one Active loan at a time — it
      // is what "My Payments" opens on by default.
      const activeLoan = myLoans.find((loan) => loan.status === "Active");
      const firstPastLoan = myLoans.find((loan) => loan.status === "Completed");
      setSelectedLoanId(activeLoan?.id ?? firstPastLoan?.id ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const selectedLoanPayments = payments.filter(
    (payment) => payment.loanId === selectedLoanId,
  );
  const { visible, hiddenUpcomingCount } = visiblePaymentRows(
    selectedLoanPayments,
  );
  const { page, setPage, totalPages, pageItems } = usePagination(visible, 5);

  if (loading) return <LoadingState label="Loading your payments…" />;

  const loanFor = (loanId) => loans.find((loan) => loan.id === loanId);
  const activeLoan = loans.find((loan) => loan.status === "Active");
  const pastLoans = loans.filter((loan) => loan.status === "Completed");
  const selectedLoan = loanFor(selectedLoanId);
  const stats = loanStats(CURRENT_CLIENT_ID, loans);
  const activeLoanPayments = activeLoan
    ? payments.filter((payment) => payment.loanId === activeLoan.id)
    : [];
  const due = amountDue(visiblePaymentRows(activeLoanPayments).all);

  const selectLoan = (id) => {
    setSelectedLoanId(id);
    setPage(1);
  };

  return (
    <>
      <PageHeading
        title="Payments"
        subtitle="Track your loan repayments and payment history."
      />

      {loans.length === 0 ? (
        <Card>
          <EmptyState
            title="No payments yet"
            detail="Your payment history will appear here once your loan repayment begins."
          />
        </Card>
      ) : (
        <>
          <div className="kpis client-payments-kpis">
            <Metric label="Total Paid" value={money(stats.repaid)} />
            <Metric
              label="Remaining Balance"
              value={money(stats.outstanding)}
            />
            {activeLoan && (
              <Metric
                label="Amount Due"
                value={money(due.total)}
                footer={
                  due.count > 0
                    ? `${due.count} payment${due.count === 1 ? "" : "s"} due`
                    : "You're all caught up"
                }
              />
            )}
          </div>

          <Card>
            <div className="section-head">
              <h3>
                {selectedLoan?.status === "Active"
                  ? "Active Loan"
                  : "Selected Loan"}
              </h3>
              {selectedLoan && (
                <Badge type={selectedLoan.status.toLowerCase()}>
                  {selectedLoan.status}
                </Badge>
              )}
            </div>

            {pastLoans.length > 0 && (
              <Select
                label="Select Loan"
                value={selectedLoanId || ""}
                onChange={(event) => selectLoan(event.target.value)}
              >
                {activeLoan && (
                  <option value={activeLoan.id}>
                    {activeLoan.type} · {activeLoan.id} (Active)
                  </option>
                )}
                {pastLoans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.type} · {loan.id} (Completed)
                  </option>
                ))}
              </Select>
            )}

            {selectedLoan ? (
              <div className="stat-grid-4">
                <div className="stat-mini">
                  <small>{selectedLoan.type}</small>
                  <strong className="mono">{selectedLoan.id}</strong>
                </div>
                <div className="stat-mini">
                  <small>Amount</small>
                  <strong>{money(selectedLoan.amount)}</strong>
                </div>
                <div className="stat-mini">
                  <small>Duration</small>
                  <strong>{selectedLoan.duration} months</strong>
                </div>
                <div className="stat-mini">
                  <small>
                    {selectedLoan.status === "Active" ? "Outstanding" : "Ended"}
                  </small>
                  <strong>
                    {selectedLoan.status === "Active"
                      ? money(selectedLoan.amount - selectedLoan.repaid)
                      : date(selectedLoan.endDate)}
                  </strong>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No active loan"
                detail="You don't currently have an active loan."
              />
            )}
          </Card>

          <Card>
            <h3>Payment History</h3>
            {pageItems.length === 0 ? (
              <EmptyState
                title="No payments found"
                detail={
                  selectedLoan
                    ? `No payment records for ${selectedLoan.id} yet.`
                    : "Select a loan above to see its payment history."
                }
              />
            ) : (
              <>
                <DataTable
                  columns={[
                    "Payment ID",
                    "Amount",
                    "Due Date",
                    "Payment Date",
                    "Status",
                    "Action",
                  ]}
                >
                  {pageItems.map((payment) => (
                    <tr key={payment.id}>
                      <td className="mono">{payment.id}</td>
                      <td className="mono">{money(payment.amount)}</td>
                      <td>{date(payment.dueDate)}</td>
                      <td>{payment.date ? date(payment.date) : "—"}</td>
                      <td>
                        <Badge type={payment.displayStatus.toLowerCase()}>
                          {PAYMENT_STATUS_LABEL[payment.displayStatus] ||
                            payment.displayStatus}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="secondary"
                          onClick={() => setViewing(payment)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </DataTable>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
                {hiddenUpcomingCount > 0 && (
                  <div className="schedule-more">
                    <span>
                      {hiddenUpcomingCount} upcoming payment
                      {hiddenUpcomingCount === 1 ? "" : "s"}
                    </span>
                    <Button
                      variant="secondary"
                      onClick={() => setShowSchedule(true)}
                    >
                      View Schedule
                    </Button>
                  </div>
                )}
              </>
            )}
          </Card>
        </>
      )}

      {viewing && (
        <PaymentDetailsModal
          payment={viewing}
          loan={loanFor(viewing.loanId)}
          onClose={() => setViewing(null)}
        />
      )}

      {showSchedule && selectedLoan && (
        <PaymentScheduleModal
          payments={selectedLoanPayments}
          onClose={() => setShowSchedule(false)}
        />
      )}
    </>
  );
}
