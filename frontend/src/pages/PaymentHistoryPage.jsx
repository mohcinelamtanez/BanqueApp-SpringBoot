import { Download } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Card,
  DataTable,
  EmptyState,
  LoadingState,
} from "../components/ui";
import { usePayments } from "../hooks/usePayments";
import { money } from "../utils/finance";
import { downloadCsv, PageHeading, StatusBadge } from "./pageShared";
export default function PaymentHistoryPage() {
  const { loanId } = useParams();
  const { loading, data = [] } = usePayments(loanId);
  if (loading) return <LoadingState />;
  const exportCsv = () =>
    downloadCsv(`${loanId}-payments.csv`, [
      "Payment ID,Amount,Payment date,Due date,Status",
      ...data.map((payment) =>
        [
          payment.id,
          payment.amount,
          payment.date || "",
          payment.dueDate,
          payment.status,
        ].join(","),
      ),
    ]);
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
        {data.length ? (
          <DataTable
            columns={[
              "Payment ID",
              "Amount",
              "Payment date",
              "Due date",
              "Status",
              "Information",
            ]}
          >
            {data.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{money(payment.amount)}</td>
                <td>{payment.date || "—"}</td>
                <td>{payment.dueDate}</td>
                <td>
                  <StatusBadge value={payment.status} />
                </td>
                <td>{payment.note}</td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <EmptyState title="No payments found" />
        )}
      </Card>
    </>
  );
}
