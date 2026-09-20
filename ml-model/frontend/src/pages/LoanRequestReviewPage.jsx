import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import {
  Breadcrumbs,
  Button,
  Card,
  ConfirmationDialog,
  EmptyState,
  Input,
  LoadingState,
  SuccessModal,
} from "../components/ui";
import { useApplication } from "../hooks/useApplications";
import { useClient } from "../hooks/useClients";
import { applicationService } from "../services/applicationService";
import { riskService } from "../services/riskService";
import { money, date, loanSummary } from "../utils/finance";
import { initials, StatusBadge } from "./pageShared";

export default function LoanRequestReviewPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { loading: applicationLoading, data: application } =
    useApplication(applicationId);
  const { loading: clientLoading, data: client } = useClient(
    application?.clientId,
  );
  const [rate, setRate] = useState("");
  const [checkingRisk, setCheckingRisk] = useState(false);
  const [riskResult, setRiskResult] = useState(null);
  const [riskError, setRiskError] = useState("");
  const [decision, setDecision] = useState(null); // "approve" | "reject" | null
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [decisionError, setDecisionError] = useState("");
  const [success, setSuccess] = useState(null);

  if (
    applicationLoading ||
    (application?.clientId && clientLoading)
  ) {
    return <LoadingState />;
  }
  if (!application) return <EmptyState title="Loan request not found" />;

  const summary = loanSummary(application.amount, application.duration, rate);

  const calculateRisk = async () => {
    setCheckingRisk(true);
    setRiskError("");
    try {
      const prediction = await riskService.calculate({
        annualIncome: client?.income || 0,
        monthlyPayment: summary.monthlyPayment,
        duration: application.duration,
        annualInterestRate: Number(rate) || 0,
      });
      setRiskResult(prediction);
    } catch {
      setRiskError(
        "The risk model is unavailable right now. Please try again in a moment.",
      );
    } finally {
      setCheckingRisk(false);
    }
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
      await applicationService.decide(application.id, {
        status: "Approved",
        rate,
        monthlyPayment: summary.monthlyPayment,
        risk: riskResult?.level,
        score: riskResult?.probability,
      });
      setDecision(null);
      setSuccess({
        title: "Application Approved Successfully",
        message: "The application has been approved and the loan is now active.",
      });
    } catch (error) {
      setDecisionError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmReject = async () => {
    setSubmitting(true);
    setDecisionError("");
    try {
      await applicationService.decide(application.id, {
        status: "Rejected",
        rejectionReason: rejectReason.trim(),
      });
      setDecision(null);
      setSuccess({
        title: "Loan Request Rejected",
        message: "The loan request has been rejected.",
      });
    } catch (error) {
      setDecisionError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isDecided = application.status !== "Pending";
  const canApprove = Boolean(rate) && Number(rate) > 0;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Loan Applications", to: "/loan-applications" },
          { label: application.reference },
        ]}
      />
      <div className="page-heading">
        <div>
          <h1>Loan Request Review</h1>
          <p>
            {client ? client.name : "Unknown client"} · {application.type} ·{" "}
            {money(application.amount)}
          </p>
        </div>
        <StatusBadge value={application.status} />
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
              <span className="mono">{application.clientId}</span>
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
            <dd>{application.type}</dd>
            <dt>Requested Amount</dt>
            <dd>{money(application.amount)}</dd>
            <dt>Requested Duration</dt>
            <dd>{application.duration} months</dd>
            <dt>Submitted</dt>
            <dd>{date(application.submittedDate)}</dd>
          </dl>
        </Card>
      </div>

      {isDecided ? (
        <Card>
          <h2>Decision</h2>
          <p>
            This application has already been decided:{" "}
            <StatusBadge value={application.status} />
          </p>
          {application.status === "Rejected" && application.rejectionReason && (
            <p className="application-decision-reason">
              <span>Reason: </span>
              {application.rejectionReason}
            </p>
          )}
        </Card>
      ) : (
        <>
          <div className="detail-grid">
            <Card>
              <h2>Loan Terms</h2>
              <div className="form-grid">
                <Input
                  label="Annual interest rate (%)"
                  type="number"
                  min="0"
                  step="0.1"
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                />
              </div>
              {rate && (
                <div className="finance-preview">
                  <b>Financial summary</b>
                  <span>Monthly payment: {money(summary.monthlyPayment)}</span>
                  <span>Total repayment: {money(summary.totalRepayment)}</span>
                </div>
              )}
            </Card>
            <Card>
              <h2>Risk Assessment</h2>
              {checkingRisk ? (
                <div className="risk-empty">
                  <LoaderCircle className="spin" />
                  <p>Calculating risk…</p>
                </div>
              ) : riskResult ? (
                <div className="risk-result">
                  <StatusBadge value={riskResult.level} risk />
                  <div className="risk-stat">
                    <small>Risk Score</small>
                    <strong>{riskResult.score}%</strong>
                  </div>
                </div>
              ) : (
                <div className="risk-empty">
                  <p>Risk assessment has not been performed yet.</p>
                  {riskError && <p className="error">{riskError}</p>}
                  <Button onClick={calculateRisk} disabled={!canApprove}>
                    Calculate Risk
                  </Button>
                </div>
              )}
            </Card>
          </div>
          <Card>
            <h2>Decision</h2>
            <div className="actions">
              <Button variant="secondary" onClick={() => setDecision("reject")}>
                Reject Request
              </Button>
              <Button
                disabled={!canApprove}
                onClick={() => setDecision("approve")}
              >
                Approve Loan
              </Button>
            </div>
          </Card>
        </>
      )}

      {decision === "approve" && (
        <ConfirmationDialog
          title="Approve Loan Request?"
          message="Are you sure you want to approve this loan request? This will create an active loan for the client."
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
          onClose={() => navigate("/loan-applications")}
        />
      )}
    </>
  );
}
