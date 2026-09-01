import { Badge, Modal } from "../ui";
import { money, date } from "../../utils/finance";
import {
  APPLICATION_STATUS_LABEL,
  applicationStatus,
} from "../../pages/client/clientShared";

export default function ApplicationDetailsModal({ loan, onClose }) {
  const status = applicationStatus(loan);

  return (
    <Modal title="Application Details" onClose={onClose}>
      <div className="decision-recap">
        <div className="decision-recap-row">
          <span>Application ID</span>
          <b className="mono">{loan.id}</b>
        </div>
        <div className="decision-recap-row">
          <span>Loan Type</span>
          <b>{loan.type}</b>
        </div>
        <div className="decision-recap-row">
          <span>Requested Amount</span>
          <b>{money(loan.amount)}</b>
        </div>
        <div className="decision-recap-row">
          <span>Duration</span>
          <b>{loan.duration} months</b>
        </div>
        <div className="decision-recap-row">
          <span>Submitted Date</span>
          <b>{date(loan.startDate)}</b>
        </div>
        <div className="decision-recap-row">
          <span>Current Status</span>
          <Badge type={loan.status.toLowerCase()}>
            {APPLICATION_STATUS_LABEL[status]}
          </Badge>
        </div>
      </div>

      {status === "PENDING" && (
        <div className="application-details-section">
          <h4>Application Status</h4>
          <p>Your application is currently under review.</p>
        </div>
      )}
      {status === "REJECTED" && (
        <div className="application-details-section">
          <h4>Decision</h4>
          <p>{loan.rejectionReason || "No rejection reason was provided."}</p>
        </div>
      )}
      {status === "APPROVED" && (
        <div className="application-details-section">
          <h4>Decision</h4>
          <p>Your application has been approved.</p>
        </div>
      )}
    </Modal>
  );
}
export { ApplicationDetailsModal };
