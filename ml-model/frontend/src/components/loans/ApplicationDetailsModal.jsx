import { Badge, Modal } from "../ui";
import { money, date } from "../../utils/finance";

export default function ApplicationDetailsModal({ application, onClose }) {
  const status = application.status;

  return (
    <Modal title="Application Details" onClose={onClose}>
      <div className="decision-recap">
        <div className="decision-recap-row">
          <span>Application ID</span>
          <b className="mono">{application.reference}</b>
        </div>
        <div className="decision-recap-row">
          <span>Loan Type</span>
          <b>{application.type}</b>
        </div>
        <div className="decision-recap-row">
          <span>Requested Amount</span>
          <b>{money(application.amount)}</b>
        </div>
        <div className="decision-recap-row">
          <span>Duration</span>
          <b>{application.duration} months</b>
        </div>
        <div className="decision-recap-row">
          <span>Submitted Date</span>
          <b>{date(application.submittedDate)}</b>
        </div>
        <div className="decision-recap-row">
          <span>Current Status</span>
          <Badge type={status.toLowerCase()}>{status}</Badge>
        </div>
      </div>

      {status === "Pending" && (
        <div className="application-details-section">
          <h4>Application Status</h4>
          <p>Your application is currently under review.</p>
        </div>
      )}
      {status === "Rejected" && (
        <div className="application-details-section">
          <h4>Decision</h4>
          <p>
            {application.rejectionReason ||
              "No rejection reason was provided."}
          </p>
        </div>
      )}
      {status === "Approved" && (
        <div className="application-details-section">
          <h4>Decision</h4>
          <p>Your application has been approved.</p>
        </div>
      )}
    </Modal>
  );
}
export { ApplicationDetailsModal };
