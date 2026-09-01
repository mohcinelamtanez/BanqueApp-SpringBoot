import { Badge, Modal } from "../ui";
import { money, date } from "../../utils/finance";
import { PAYMENT_STATUS_LABEL } from "../../pages/client/clientShared";

export default function PaymentDetailsModal({ payment, loan, onClose }) {
  return (
    <Modal title="Payment Details" onClose={onClose}>
      <div className="decision-recap">
        <div className="decision-recap-row">
          <span>Payment ID</span>
          <b className="mono">{payment.id}</b>
        </div>
        <div className="decision-recap-row">
          <span>Loan</span>
          <b>{loan ? `${loan.type} · ${loan.id}` : payment.loanId}</b>
        </div>
        <div className="decision-recap-row">
          <span>Amount</span>
          <b>{money(payment.amount)}</b>
        </div>
        <div className="decision-recap-row">
          <span>Due Date</span>
          <b>{date(payment.dueDate)}</b>
        </div>
        <div className="decision-recap-row">
          <span>Payment Date</span>
          <b>{payment.date ? date(payment.date) : "—"}</b>
        </div>
        <div className="decision-recap-row">
          <span>Status</span>
          <Badge type={payment.status.toLowerCase()}>
            {PAYMENT_STATUS_LABEL[payment.status] || payment.status}
          </Badge>
        </div>
      </div>
      {payment.note && <p className="decision-note">{payment.note}</p>}
    </Modal>
  );
}
export { PaymentDetailsModal };
