import { DataTable } from "../ui";
export default function PaymentTable({ payments = [] }) {
  return (
    <DataTable
      columns={["Payment ID", "Amount", "Payment date", "Due date", "Status"]}
    >
      {payments.map((payment) => (
        <tr key={payment.id}>
          <td>{payment.id}</td>
          <td>{payment.amount}</td>
          <td>{payment.date || "—"}</td>
          <td>{payment.dueDate}</td>
          <td>{payment.status}</td>
        </tr>
      ))}
    </DataTable>
  );
}
