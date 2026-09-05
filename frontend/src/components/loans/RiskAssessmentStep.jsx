import { useState } from "react";
import { LoaderCircle, RefreshCw, ShieldCheck, User } from "lucide-react";
import { Button, Card } from "../ui";
import { money, loanSummary } from "../../utils/finance";
import { riskService } from "../../services/riskService";

const LEVEL_COPY = {
  LOW: "The algorithmic model found no significant risk factors for this application based on the applicant's income and the requested loan terms.",
  MEDIUM:
    "The algorithmic model identified moderate risk factors based on the applicant's debt-to-income ratio. Manual review is recommended before proceeding.",
  HIGH: "The algorithmic model has identified significant risk factors based on the applicant's debt-to-income ratio. Manual review is highly recommended before proceeding with authorization.",
};

export default function RiskAssessmentStep({
  client,
  values,
  result,
  onResult,
  onBack,
  onNext,
}) {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const calculateRisk = async () => {
    setChecking(true);
    setError("");
    try {
      const summary = loanSummary(values.amount, values.duration, values.rate);
      const prediction = await riskService.calculate({
        annualIncome: client?.income || 0,
        monthlyPayment: summary.monthlyPayment,
        duration: values.duration,
        annualInterestRate: values.rate,
      });
      onResult({
        score: prediction.score,
        probability: prediction.probability,
        level: prediction.level,
        decision: prediction.decision,
      });
    } catch {
      setError(
        "The risk model is unavailable right now. Please try again in a moment.",
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="assessment-grid">
      <Card className="assessment-card">
        <h2 className="icon-heading">
          <User size={18} /> Applicant Summary
        </h2>
        <dl>
          <dt>Annual Income</dt>
          <dd>{client ? money(client.income) : "—"}</dd>
          <dt>Requested Amount</dt>
          <dd>{money(values.amount)}</dd>
          <dt>Duration</dt>
          <dd>{values.duration} Months</dd>
          <dt>Loan Type</dt>
          <dd>{values.loanType}</dd>
        </dl>
      </Card>
      <Card className="assessment-card risk-panel">
        {checking ? (
          <div className="risk-initial">
            <LoaderCircle size={32} className="spin" />
            <h3>Analyzing risk…</h3>
            <p>
              Evaluating the applicant's profile against the requested loan
              terms.
            </p>
          </div>
        ) : result ? (
          <div className="risk-result-full">
            <div className="risk-result-top">
              <div className="risk-score-block">
                <small>Risk Score</small>
                <div className="risk-score-value">{result.score}%</div>
              </div>
              <div className="risk-level-block">
                <small>Risk Level</small>
                <div
                  className={`risk-level-pill ${result.level.toLowerCase()}`}
                >
                  <i />
                  {result.level}
                </div>
              </div>
            </div>
            <div className="risk-explain">
              <h4>AI Risk Assessment</h4>
              <p>{LEVEL_COPY[result.level]}</p>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="risk-recalculate">
              <Button variant="secondary" onClick={calculateRisk}>
                <RefreshCw size={16} /> Recalculate Risk
              </Button>
            </div>
          </div>
        ) : (
          <div className="risk-initial">
            <span className="risk-initial-icon">
              <ShieldCheck size={28} />
            </span>
            <h3>Risk assessment has not been performed yet</h3>
            <p>
              Run the algorithmic risk model against the applicant's profile
              and the requested loan terms before proceeding.
            </p>
            {error && <p className="error">{error}</p>}
            <Button onClick={calculateRisk}>Calculate Risk</Button>
          </div>
        )}
      </Card>
      <div className="assessment-footer-split">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button disabled={!result} onClick={onNext}>
          Next: Decision
        </Button>
      </div>
    </div>
  );
}
export { RiskAssessmentStep };
