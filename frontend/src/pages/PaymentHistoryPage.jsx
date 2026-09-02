import { useEffect, useState } from "react";
import { CheckCircle2, Download, Eye, RotateCcw } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Card,
  ConfirmationDialog,
  DataTable,
  EmptyState,
  LoadingState,
  Pagination,
  SuccessModal,
} from "../components/ui";
import PaymentDetailsModal from "../components/payments/PaymentDetailsModal";
import PaymentScheduleModal from "../components/payments/PaymentScheduleModal";
import { useLoan } from "../hooks/useLoans";
import { usePayments } from "../hooks/usePayments";
import { usePagination } from "../hooks/usePagination";
import { loanService } from "../services/loanService";
import { paymentService } from "../services/paymentService";
import { money } from "../utils/finance";
import { getPaymentStatus, visiblePaymentRows } from "../utils/paymentSchedule";
import { downloadCsv, PageHeading, StatusBadge } from "./pageShared";

export default function PaymentHistoryPage() {
  const { loanId } = useParams();
  const { loading, data } = usePayments(loanId);
  const { data: loan } = useLoan(loanId);
  const [payments, setPayments] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { payment, type: "pay" | "unpay" }
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (data) setPayments(data);
  }, [data]);

  const { visible, hiddenUpcomingCount } = visiblePaymentRows(payments);
  const { page, setPage, totalPages, pageItems } = usePagination(visible, 8);

  if (loading) return <LoadingState />;

  const exportCsv = () =>
    downloadCsv(`${loanId}-payments.csv`, [
      "Payment ID,Amount,Payment date,Due date,Status",
      ...payments.map((payment) =>
        [
          payment.id,
          payment.amount,
          payment.date || "",
          payment.dueDate,
          getPaymentStatus(payment),
        ].join(","),
      ),
    ]);

  const closeConfirm = () => {
    if (submitting) return;
    setConfirmAction(null);
    setActionError("");
  };

  const runConfirmedAction = async () => {
    const { payment, type } = confirmAction;
    setSubmitting(true);
    setActionError("");
    try {
      const updated =
        type === "pay"
          ? await paymentService.markPaid(payment.id)
          : await paymentService.markUnpaid(payment.id);
      const nextPayments = payments.map((p) =>
        p.id === updated.id ? updated : p,
      );
      setPayments(nextPayments);
      setConfirmAction(null);

      if (loan) {
        const allPaid = nextPayments.every((p) => p.status === "PAID");
        if (type === "pay" && allPaid && loan.status === "Active") {
          await loanService.update(loan.id, { status: "Completed" });
        } else if (type === "unpay" && !allPaid && loan.status === "Completed") {
          await loanService.update(loan.id, { status: "Active" });
        }
      }

      setSuccess(
        type === "pay"
          ? {
              title: "Payment Marked as Paid",
              message: "The payment has been recorded as paid.",
            }
          : {
              title: "Payment Marked as Unpaid",
              message: "The payment has been reverted to unpaid.",
            },
      );
    } catch {
      setActionError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Loans", to: "/loans" },
          { label: loanId, to: `/loans/${loanId}` },
          { label: "Payments" },
        ]}
      />
      <PageHeading
        title="Payment History"
        subtitle={`Payment activity for ${loanId}.`}
        action={
          <Button variant="secondary" onClick={exportCsv}>
            <Download size={16} /> Export CSV
          </Button>
        }
      />
      <Card>
        {visible.length ? (
          <>
            <DataTable
              columns={[
                "Payment ID",
                "Amount",
                "Payment date",
                "Due date",
                "Status",
                "Actions",
              ]}
            >
              {pageItems.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{money(payment.amount)}</td>
                  <td>{payment.date || "—"}</td>
                  <td>{payment.dueDate}</td>
                  <td>
                    <StatusBadge value={payment.displayStatus} />
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        onClick={() => setViewing(payment)}
                        aria-label="View payment details"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {payment.status === "PAID" ? (
                        <button
                          onClick={() =>
                            setConfirmAction({ payment, type: "unpay" })
                          }
                          aria-label="Mark payment as unpaid"
                          title="Mark as Unpaid"
                        >
                          <RotateCcw size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setConfirmAction({ payment, type: "pay" })
                          }
                          aria-label="Mark payment as paid"
                          title="Mark as Paid"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </DataTable>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            {hiddenUpcomingCount > 0 && (
              <div className="schedule-more">
                <span>
                  {hiddenUpcomingCount} more upcoming payment
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
        ) : (
          <EmptyState title="No payments found" />
        )}
      </Card>

      {viewing && (
        <PaymentDetailsModal
          payment={viewing}
          loan={loan}
          onClose={() => setViewing(null)}
        />
      )}

      {showSchedule && (
        <PaymentScheduleModal
          payments={payments}
          onClose={() => setShowSchedule(false)}
        />
      )}

      {confirmAction && (
        <ConfirmationDialog
          title={
            confirmAction.type === "pay"
              ? "Mark Payment as Paid?"
              : "Mark Payment as Unpaid?"
          }
          message={
            confirmAction.type === "pay"
              ? `Confirm that ${confirmAction.payment.id} (${money(confirmAction.payment.amount)}) was paid by the client at the branch. This will mark it as PAID today.`
              : `Revert ${confirmAction.payment.id} (${money(confirmAction.payment.amount)}) back to unpaid? Use this only to correct a payment confirmed by mistake.`
          }
          confirmLabel={
            confirmAction.type === "pay" ? "Mark as Paid" : "Mark as Unpaid"
          }
          confirmVariant="primary"
          submitting={submitting}
          error={actionError}
          onClose={closeConfirm}
          onConfirm={runConfirmedAction}
        />
      )}

      {success && (
        <SuccessModal
          title={success.title}
          message={success.message}
          onClose={() => setSuccess(null)}
        />
      )}
    </>
  );
}
