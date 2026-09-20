import { Badge, DataTable, Modal } from "../ui";
import { money, date } from "../../utils/finance";
import { withDisplayStatus } from "../../utils/paymentSchedule";
import { PAYMENT_STATUS_LABEL } from "../../pages/client/clientShared";

export default function PaymentScheduleModal({ payments, onClose }) {
  const rows = withDisplayStatus(payments).sort((a, b) =>
    a.dueDate < b.dueDate ? -1 : 1,
  );
  return (
    <Modal
      title="Full Payment Schedule"
      onClose={onClose}
      className="schedule-modal"
    >
      <div className="schedule-modal-body">
        <DataTable columns={["#", "Due Date", "Amount", "Payment Date", "Status"]}>
          {rows.map((payment, index) => (
            <tr key={payment.id}>
              <td>{index + 1}</td>
              <td>{date(payment.dueDate)}</td>
              <td>{money(payment.amount)}</td>
              <td>{payment.date ? date(payment.date) : "—"}</td>
              <td>
                <Badge type={payment.displayStatus.toLowerCase()}>
                  {PAYMENT_STATUS_LABEL[payment.displayStatus]}
                </Badge>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </Modal>
  );
}
export { PaymentScheduleModal };
