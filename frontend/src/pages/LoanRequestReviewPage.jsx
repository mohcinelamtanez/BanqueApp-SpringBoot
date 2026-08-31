import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import {
  Breadcrumbs,
  Button,
  Card,
  ConfirmationDialog,
  EmptyState,
  LoadingState,
  SuccessModal,
} from "../components/ui";
import { useLoan } from "../hooks/useLoans";
import { loanService } from "../services/loanService";
import { money, date } from "../utils/finance";
import { getClient, initials, StatusBadge } from "./pageShared";

const RISK_PROBABILITY = {
  LOW: "8.4%",
  MEDIUM: "34.2%",
  HIGH: "68.5%",
};

export default function LoanRequestReviewPage() {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const { loading, data: loan } = useLoan(loanId);
  const [checkingRisk, setCheckingRisk] = useState(false);
  const [riskChecked, setRiskChecked] = useState(false);
  const [decision, setDecision] = useState(null); // "approve" | "reject" | null
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [decisionError, setDecisionError] = useState("");
  const [success, setSuccess] = useState(null);

  if (loading) return <LoadingState />;
  if (!loan) return <EmptyState title="Loan request not found" />;

  const client = getClient(loan.clientId);
  const risk = (loan.risk || "LOW").toUpperCase();
  const probability = RISK_PROBABILITY[risk] || RISK_PROBABILITY.LOW;

  const calculateRisk = () => {
    setCheckingRisk(true);
    setTimeout(() => {
      setCheckingRisk(false);
      setRiskChecked(true);
    }, 900);
  };

  const closeDecision = () => {
    if (submitting) return;
    setDecision(null);
    setDecisionError("");
    setRejectReason("");
  };

  const confirmApprove = async () => {
    setSubmitting(true);
    setDecisionError("");
    try {
      await loanService.update(loan.id, { status: "Active" });
      setDecision(null);
      setSuccess({
        title: "Loan Approved Successfully",
        message: "The loan has been approved and is now active.",
      });
    } catch {
      setDecisionError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmReject = async () => {
    setSubmitting(true);
    setDecisionError("");
    try {
      await loanService.update(loan.id, {
        status: "Rejected",
        rejectionReason: rejectReason.trim(),
      });
      setDecision(null);
      setSuccess({
        title: "Loan Request Rejected",
        message: "The loan request has been rejected.",
      });
    } catch {
      setDecisionError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Loan Requests", to: "/loans/requests" },
          { label: loan.id },
        ]}
      />
      <div className="page-heading">
        <div>
          <h1>Loan Request Review</h1>
          <p>
            {client ? client.name : "Unknown client"} · {loan.type} ·{" "}
            {money(loan.amount)}
          </p>
        </div>
        <StatusBadge value={loan.status} />
      </div>
      <div className="detail-grid">
        <Card>
          <h2>Client Information</h2>
          <div className="review-client">
            <span className="avatar">
              {client ? initials(client.name) : "?"}
            </span>
            <div>
              <strong>{client ? client.name : "Unknown client"}</strong>
              <span className="mono">{loan.clientId}</span>
            </div>
          </div>
          <dl>
            <dt>Location</dt>
            <dd>{client ? `${client.city}, Morocco` : "—"}</dd>
            <dt>Annual Revenue</dt>
            <dd>{client ? `${money(client.income)}/year` : "—"}</dd>
          </dl>
        </Card>
        <Card>
          <h2>Loan Request</h2>
          <dl>
            <dt>Loan Type</dt>
            <dd>{loan.type}</dd>
            <dt>Requested Amount</dt>
            <dd>{money(loan.amount)}</dd>
            <dt>Requested Duration</dt>
            <dd>{loan.duration} months</dd>
            <dt>Submitted</dt>
            <dd>{date(loan.startDate)}</dd>
          </dl>
        </Card>
      </div>
      <div className="detail-grid">
        <Card>
          <h2>Risk Assessment</h2>
          {checkingRisk ? (
            <div className="risk-empty">
              <LoaderCircle className="spin" />
              <p>Calculating risk…</p>
            </div>
          ) : riskChecked ? (
            <div className="risk-result">
              <StatusBadge value={risk} risk />
              <div className="risk-stat">
                <small>Probability</small>
                <strong>{probability}</strong>
              </div>
            </div>
          ) : (
            <div className="risk-empty">
              <p>Risk assessment has not been performed yet.</p>
              <Button onClick={calculateRisk}>Calculate Risk</Button>
            </div>
          )}
        </Card>
        <Card>
          <h2>Decision</h2>
          <div className="actions">
            <Button variant="secondary" onClick={() => setDecision("reject")}>
              Reject Request
            </Button>
            <Button onClick={() => setDecision("approve")}>
              Approve Loan
            </Button>
          </div>
        </Card>
      </div>
      {decision === "approve" && (
        <ConfirmationDialog
          title="Approve Loan Request?"
          message="Are you sure you want to approve this loan request?"
          confirmLabel="Approve Loan"
          confirmVariant="primary"
          submitting={submitting}
          error={decisionError}
          onClose={closeDecision}
          onConfirm={confirmApprove}
        />
      )}
      {decision === "reject" && (
        <ConfirmationDialog
          title="Reject Loan Request?"
          message="Please provide a reason for rejecting this request."
          confirmLabel="Reject Request"
          confirmDisabled={!rejectReason.trim()}
          submitting={submitting}
          error={decisionError}
          onClose={closeDecision}
          onConfirm={confirmReject}
        >
          <div className="field">
            <textarea
              placeholder="Rejection reason…"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={3}
            />
          </div>
        </ConfirmationDialog>
      )}
      {success && (
        <SuccessModal
          title={success.title}
          message={success.message}
          onClose={() => navigate("/loans/requests")}
        />
      )}
    </>
  );
}
