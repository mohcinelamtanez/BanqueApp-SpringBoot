import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button, Card } from "../ui";
import { money, date } from "../../utils/finance";

const STATUS_META = {
  Pending: { label: "Under Review", icon: Clock, tone: "pending" },
  Rejected: { label: "Declined", icon: XCircle, tone: "rejected" },
  Approved: { label: "Approved", icon: CheckCircle2, tone: "approved" },
};

export default function ApplicationCard({
  application,
  loan = null,
  onViewDetails,
  onCreateNew,
  canCreateNew = true,
}) {
  const navigate = useNavigate();
  const status = application.status;
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  const loanCompleted = status === "Approved" && loan?.status === "Completed";

  return (
    <Card className="application-card">
      <div className="application-card-head">
        <div>
          <h3>{application.type}</h3>
          <div className="application-card-facts">
            <span className="mono">{money(application.amount)}</span>
            <span>{application.duration} months</span>
          </div>
          <p className="application-card-date">
            Submitted {date(application.submittedDate)}
          </p>
        </div>
        <span className={`application-status-pill ${meta.tone}`}>
          <Icon size={14} />
          {meta.label}
        </span>
      </div>

      {status === "Pending" && (
        <div className="application-decision-note pending">
          <p>
            Your application is currently being reviewed. You will be
            notified once a decision has been made.
          </p>
        </div>
      )}

      {status === "Rejected" && (
        <div className="application-decision-panel rejected">
          <h4>Application Declined</h4>
          <p>
            Unfortunately, your loan application could not be approved at
            this time.
          </p>
          <div className="application-decision-reason">
            <span>Reason</span>
            <p>
              {application.rejectionReason ||
                "No rejection reason was provided."}
            </p>
          </div>
        </div>
      )}

      {status === "Approved" && loanCompleted && (
        <div className="application-decision-panel approved">
          <h4>Loan Completed</h4>
          <p>
            Your loan has been fully repaid and is now completed. You can
            submit a new loan application whenever you're ready.
          </p>
        </div>
      )}

      {status === "Approved" && !loanCompleted && (
        <div className="application-decision-panel approved">
          <h4>Application Approved</h4>
          <p>Your loan application has been approved. Your loan is now active.</p>
        </div>
      )}

      <div className="application-card-actions">
        <Button variant="secondary" onClick={onViewDetails}>
          View Details
        </Button>
        {status === "Rejected" && canCreateNew && (
          <Button onClick={onCreateNew}>Create New Application</Button>
        )}
        {status === "Approved" && (
          <Button onClick={() => navigate("/my-loans")}>View Loan</Button>
        )}
        {loanCompleted && canCreateNew && (
          <Button onClick={onCreateNew}>Create New Application</Button>
        )}
      </div>
    </Card>
  );
}
export { ApplicationCard };
