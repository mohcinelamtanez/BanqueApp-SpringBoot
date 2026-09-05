import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ban,
  Brain,
  CheckCheck,
  CheckCircle2,
  Gavel,
  Receipt,
  User,
} from "lucide-react";
import { Button, Card, Modal, SuccessModal } from "../ui";
import { money, loanSummary } from "../../utils/finance";
import { loanStats } from "../../pages/pageShared";
import { loanService } from "../../services/loanService";

export default function DecisionStep({ client, values, risk, loans, onBack }) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null); // "approve" | "reject" | null
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(null);

  const summary = loanSummary(values.amount, values.duration, values.rate);
  const stats = client ? loanStats(client.id, loans || []) : null;
  const riskLevel = risk?.level?.toLowerCase() || "";

  const closeModal = () => {
    if (submitting) return;
    setModal(null);
    setRejectReason("");
    setSubmitError("");
  };

  const createLoan = (status, rejectionReason) =>
    loanService.create({
      clientId: client.id,
      type: values.loanType,
      amount: values.amount,
      duration: values.duration,
      rate: values.rate,
      monthlyPayment: summary.monthlyPayment,
      risk: risk?.level,
      score: risk?.probability,
      status,
      rejectionReason,
    });

  const confirmApprove = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await createLoan("Active");
      setModal(null);
      setSuccess({
        title: "Loan Approved Successfully",
        message:
          "The loan has been approved and is now active. Its repayment schedule will be available once payments are connected.",
      });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmReject = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      await createLoan("Rejected", rejectReason.trim());
      setModal(null);
      setRejectReason("");
      setSuccess({
        title: "Loan Request Rejected",
        message: "The loan application has been marked as rejected.",
      });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="assessment-grid">
        <div className="stack-gap">
          <Card className="assessment-card">
            <div className="decision-section-head">
              <h2 className="icon-heading">
                <User size={18} /> Client Summary
              </h2>
              {client && (
                <button
                  type="button"
                  className="decision-link-btn"
                  onClick={() => navigate(`/clients/${client.id}`)}
                >
                  View Full Profile
                </button>
              )}
            </div>
            <div className="decision-row-list">
              <div className="decision-row">
                <span>Name</span>
                <b>{client?.name || "—"}</b>
              </div>
              <div className="decision-row">
                <span>Annual Income</span>
                <b className="mono">{client ? money(client.income) : "—"}</b>
              </div>
              <div className="decision-row">
                <span>Existing Loans</span>
                <b>{stats ? `${stats.active} Active` : "—"}</b>
              </div>
              <div className="decision-row">
                <span>Outstanding Balance</span>
                <b className="mono">
                  {stats ? money(stats.outstanding) : "—"}
                </b>
              </div>
              <div className="decision-row">
                <span>History</span>
                <span>
                  {stats ? (
                    <>
                      <span className="decision-history-badge">
                        {stats.completed} Completed
                      </span>
                      <span className="decision-history-sep">|</span>
                      {stats.rejected} Rejected
                    </>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
            </div>
          </Card>
          <Card className="assessment-card">
            <h2 className="icon-heading">
              <Receipt size={18} /> Loan Parameters
            </h2>
            <div className="stat-grid-2">
              <div className="stat-mini">
                <small>Amount</small>
                <strong>{money(values.amount)}</strong>
              </div>
              <div className="stat-mini">
                <small>Duration</small>
                <strong>{values.duration} Months</strong>
              </div>
              <div className="stat-mini">
                <small>Rate</small>
                <strong>{values.rate}% Fixed</strong>
              </div>
              <div className="stat-mini">
                <small>Monthly Payment</small>
                <strong>{money(summary.monthlyPayment)}</strong>
              </div>
            </div>
            <div className="decision-row-list decision-row-list-tight">
              <div className="decision-row">
                <span>Total Repayment</span>
                <b className="mono">{money(summary.totalRepayment)}</b>
              </div>
              <div className="decision-row">
                <span>Total Interest</span>
                <b className="mono">{money(summary.estimatedInterest)}</b>
              </div>
              <div className="decision-row">
                <span>Installments</span>
                <b>{values.duration}</b>
              </div>
            </div>
          </Card>
        </div>
        <div className="stack-gap">
          <Card className="assessment-card risk-workspace-card">
            <div className="risk-workspace-blob" />
            <div className="risk-workspace-head">
              <div>
                <h2 className="icon-heading">
                  <Brain size={18} /> AI Risk Assessment
                </h2>
                <p>
                  The risk assessment is provided as decision support. The
                  final decision remains the responsibility of the bank
                  administrator.
                </p>
              </div>
              <div className="risk-workspace-badge-wrap">
                {risk ? (
                  <>
                    <span className={`risk-workspace-badge ${riskLevel}`}>
                      <CheckCircle2 size={18} />
                      {risk.level} RISK
                    </span>
                    <span className="risk-workspace-confidence">
                      {risk.score}% Risk Score
                    </span>
                  </>
                ) : (
                  <span className="risk-workspace-badge">Not assessed</span>
                )}
              </div>
            </div>
            <div className="stat-grid-2">
              <div className="stat-mini center">
                <small>Risk Score</small>
                <strong>{risk ? `${risk.score}%` : "—"}</strong>
              </div>
              <div className="stat-mini center">
                <small>Model Decision</small>
                <strong>{risk ? risk.decision : "—"}</strong>
              </div>
            </div>
          </Card>
          <Card className="assessment-card">
            <h2 className="icon-heading">
              <Gavel size={18} /> Administrative Decision
            </h2>
            <div className="decision-option">
              <div>
                <h3>Approve Loan</h3>
                <p>
                  By approving this loan, the loan will become active and the
                  repayment schedule will be created immediately.
                </p>
              </div>
              <Button onClick={() => setModal("approve")}>
                <CheckCheck size={16} /> Approve
              </Button>
            </div>
            <div className="decision-divider">
              <span>OR</span>
            </div>
            <div className="decision-option">
              <div>
                <h3>Reject Application</h3>
                <p>
                  Rejecting this loan will mark the application as rejected
                  and notify the client.
                </p>
              </div>
              <Button variant="secondary" onClick={() => setModal("reject")}>
                <Ban size={16} /> Reject
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <div className="assessment-footer-split">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
      </div>
      <div className="decision-footer-audit">
        <div>Decision Support Data</div>
        <div className="decision-footer-audit-items">
          <span>Assessment Date: {new Date().toLocaleDateString()}</span>
          <span>Model Version: v2.4-stable</span>
          <span>Administrator: Current User</span>
        </div>
      </div>

      {modal === "approve" && (
        <Modal title="Approve this loan?" onClose={closeModal}>
          <div className="decision-recap">
            <div className="decision-recap-row">
              <span>Client</span>
              <b>{client?.name || "—"}</b>
            </div>
            <div className="decision-recap-row">
              <span>Amount</span>
              <b>{money(values.amount)}</b>
            </div>
            <div className="decision-recap-row">
              <span>Monthly Payment</span>
              <b>{money(summary.monthlyPayment)}</b>
            </div>
            <div className="decision-recap-row">
              <span>Duration</span>
              <b>{values.duration} months</b>
            </div>
            <div className="decision-recap-row">
              <span>Risk</span>
              {risk ? (
                <span className={`risk-badge-sm ${riskLevel}`}>
                  {risk.level}
                </span>
              ) : (
                <b>Not assessed</b>
              )}
            </div>
          </div>
          <p className="decision-note">
            Confirming this action will activate the loan and generate the
            repayment schedule immediately.
          </p>
          {submitError && <p className="error">{submitError}</p>}
          <div className="decision-modal-actions">
            <Button
              variant="secondary"
              onClick={closeModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={confirmApprove}
              disabled={submitting}
            >
              {submitting ? "Approving…" : "Confirm Approval"}
            </Button>
          </div>
        </Modal>
      )}

      {modal === "reject" && (
        <Modal title="Reject this loan?" onClose={closeModal}>
          <div className="decision-recap decision-recap-simple">
            <p>
              Applicant: <b>{client?.name || "—"}</b>
            </p>
            <p>
              Amount: <b>{money(values.amount)}</b>
            </p>
            <p>
              Risk Level:{" "}
              <b className={riskLevel}>{risk ? risk.level : "Not assessed"}</b>
            </p>
          </div>
          <div className="field-group">
            <label>Rejection Reason</label>
            <textarea
              placeholder="Provide a reason for the rejection (required)…"
              rows={4}
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
            />
          </div>
          {submitError && <p className="error">{submitError}</p>}
          <div className="decision-modal-actions">
            <Button
              variant="secondary"
              onClick={closeModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={!rejectReason.trim() || submitting}
              onClick={confirmReject}
            >
              {submitting ? "Rejecting…" : "Confirm Rejection"}
            </Button>
          </div>
        </Modal>
      )}

      {success && (
        <SuccessModal
          title={success.title}
          message={success.message}
          onClose={() => navigate("/loans")}
        />
      )}
    </>
  );
}
export { DecisionStep };
