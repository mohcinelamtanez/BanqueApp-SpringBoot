import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button, Card } from "../ui";
import { money, date } from "../../utils/finance";
import { applicationStatus } from "../../pages/client/clientShared";

const STATUS_META = {
  PENDING: { label: "Under Review", icon: Clock, tone: "pending" },
  REJECTED: { label: "Declined", icon: XCircle, tone: "rejected" },
  APPROVED: { label: "Approved", icon: CheckCircle2, tone: "approved" },
};

export default function ApplicationCard({
  loan,
  onViewDetails,
  onCreateNew,
  canCreateNew = true,
}) {
  const navigate = useNavigate();
  const status = applicationStatus(loan);
  const meta = STATUS_META[status];
  const Icon = meta.icon;

  return (
    <Card className="application-card">
      <div className="application-card-head">
        <div>
          <h3>{loan.type}</h3>
          <div className="application-card-facts">
            <span className="mono">{money(loan.amount)}</span>
            <span>{loan.duration} months</span>
          </div>
          <p className="application-card-date">
            Submitted {date(loan.startDate)}
          </p>
        </div>
        <span className={`application-status-pill ${meta.tone}`}>
          <Icon size={14} />
          {meta.label}
        </span>
      </div>

      {status === "PENDING" && (
        <div className="application-decision-note pending">
          <p>
            Your application is currently being reviewed. You will be
            notified once a decision has been made.
          </p>
        </div>
      )}

      {status === "REJECTED" && (
        <div className="application-decision-panel rejected">
          <h4>Application Declined</h4>
          <p>
            Unfortunately, your loan application could not be approved at
            this time.
          </p>
          <div className="application-decision-reason">
            <span>Reason</span>
            <p>
              {loan.rejectionReason || "No rejection reason was provided."}
            </p>
          </div>
        </div>
      )}

      {status === "APPROVED" && (
        <div className="application-decision-panel approved">
          <h4>Application Approved</h4>
          <p>
            {loan.status === "Completed"
              ? "This loan was approved and has since been fully repaid."
              : "Your loan application has been approved. Your loan is now active."}
          </p>
        </div>
      )}

      <div className="application-card-actions">
        <Button variant="secondary" onClick={onViewDetails}>
          View Details
        </Button>
        {status === "REJECTED" && canCreateNew && (
          <Button onClick={onCreateNew}>Create New Application</Button>
        )}
        {status === "APPROVED" && (
          <Button onClick={() => navigate("/my-loans")}>
            View Loan
          </Button>
        )}
      </div>
    </Card>
  );
}
export { ApplicationCard };
