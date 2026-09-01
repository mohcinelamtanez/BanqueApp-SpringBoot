import { useEffect, useState } from "react";
import { CalendarClock, Landmark } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  DataTable,
  EmptyState,
  LoadingState,
  Pagination,
} from "../../components/ui";
import PaymentDetailsModal from "../../components/payments/PaymentDetailsModal";
import { loanService } from "../../services/loanService";
import { paymentService } from "../../services/paymentService";
import { usePagination } from "../../hooks/usePagination";
import { money, date } from "../../utils/finance";
import { loanStats, Metric, PageHeading } from "../pageShared";
import { CURRENT_CLIENT_ID, PAYMENT_STATUS_LABEL } from "./clientShared";

export default function ClientPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [viewing, setViewing] = useState(null);

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
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const sortedPayments = [...payments].sort((a, b) =>
    a.dueDate < b.dueDate ? 1 : -1,
  );
  const { page, setPage, totalPages, pageItems } = usePagination(
    sortedPayments,
    5,
  );

  if (loading) return <LoadingState label="Loading your payments…" />;

  const loanFor = (loanId) => loans.find((loan) => loan.id === loanId);
  const stats = loanStats(CURRENT_CLIENT_ID, loans);
  const nextPayment = payments
    .filter((payment) => payment.status === "Outstanding")
    .sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1))[0];
  const nextPaymentLoan = nextPayment ? loanFor(nextPayment.loanId) : null;

  return (
    <>
      <PageHeading
        title="Payments"
        subtitle="Track your loan repayments and payment history."
      />

      {payments.length > 0 && (
        <>
          <div className="kpis client-payments-kpis">
            <Metric
              label="Total Paid"
              value={money(stats.repaid)}
              icon={<Landmark />}
            />
            <Metric
              label="Remaining Balance"
              value={money(stats.outstanding)}
              icon={<Landmark />}
            />
          </div>
          {nextPayment && (
            <Card className="metric next-payment-card">
              <div>
                <small>NEXT PAYMENT</small>
                <strong>{money(nextPayment.amount)}</strong>
                <p>Due {date(nextPayment.dueDate)}</p>
                <div className="next-payment-loan">
                  <span>Loan</span>
                  <b>
                    {nextPaymentLoan
                      ? `${nextPaymentLoan.type} · ${nextPaymentLoan.id}`
                      : nextPayment.loanId}
                  </b>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setViewing(nextPayment)}
                >
                  View Payment Details
                </Button>
              </div>
              <CalendarClock />
            </Card>
          )}
        </>
      )}

      <Card>
        {payments.length === 0 ? (
          <EmptyState
            title="No payments yet"
            detail="Your payment history will appear here once your loan repayment begins."
          />
        ) : (
          <>
            <DataTable
              columns={[
                "Payment ID",
                "Loan",
                "Amount",
                "Due Date",
                "Payment Date",
                "Status",
                "Action",
              ]}
            >
              {pageItems.map((payment) => {
                const loan = loanFor(payment.loanId);
                return (
                  <tr key={payment.id}>
                    <td className="mono">{payment.id}</td>
                    <td>
                      <b>{loan ? loan.type : "—"}</b>
                      <br />
                      <span className="mono">{payment.loanId}</span>
                    </td>
                    <td className="mono">{money(payment.amount)}</td>
                    <td>{date(payment.dueDate)}</td>
                    <td>{payment.date ? date(payment.date) : "—"}</td>
                    <td>
                      <Badge type={payment.status.toLowerCase()}>
                        {PAYMENT_STATUS_LABEL[payment.status] ||
                          payment.status}
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
                );
              })}
            </DataTable>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </Card>

      {viewing && (
        <PaymentDetailsModal
          payment={viewing}
          loan={loanFor(viewing.loanId)}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  );
}
