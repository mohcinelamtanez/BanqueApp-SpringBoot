import { ArrowRight } from "lucide-react";
import { Button, Card } from "../ui";
import { money, loanSummary } from "../../utils/finance";

const LOAN_TYPES = ["Consumer (CONSO)", "Automobile (AUTO)"];

export default function LoanDetailsStep({ values, onChange, onBack, onNext }) {
  const summary = loanSummary(values.amount, values.duration, values.rate);
  return (
    <div className="loan-details-layout">
      <Card className="assessment-card loan-details-form">
        <h2>Loan Parameters</h2>
        <div className="field-group">
          <label>Loan Type</label>
          <div className="loan-type-options">
            {LOAN_TYPES.map((type) => (
              <label
                key={type}
                className={
                  values.loanType === type
                    ? "loan-type-option checked"
                    : "loan-type-option"
                }
              >
                <input
                  type="radio"
                  name="loan_type"
                  className="loan-type-input"
                  checked={values.loanType === type}
                  onChange={() => onChange({ loanType: type })}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
        <div className="field-group">
          <label>Requested Amount</label>
          <div className="field-suffix">
            <input
              type="number"
              value={values.amount}
              onChange={(event) =>
                onChange({ amount: Number(event.target.value) })
              }
            />
            <span className="suffix">MAD</span>
          </div>
          <p className="field-hint">
            Eligible range: 10,000 - 350,000 MAD based on pre-approval.
          </p>
        </div>
        <div className="loan-details-grid">
          <div className="field-group">
            <label>Duration</label>
            <div className="field-suffix">
              <input
                type="number"
                value={values.duration}
                onChange={(event) =>
                  onChange({ duration: Number(event.target.value) })
                }
              />
              <span className="suffix">Months</span>
            </div>
          </div>
          <div className="field-group">
            <label>Annual Interest Rate</label>
            <div className="field-suffix">
              <input
                type="number"
                step="0.1"
                value={values.rate}
                onChange={(event) =>
                  onChange({ rate: Number(event.target.value) })
                }
              />
              <span className="suffix">%</span>
            </div>
          </div>
        </div>
      </Card>
      <div className="loan-details-summary">
        <div className="loan-summary-card">
          <div className="loan-summary-head">
            <h3>Financial Summary</h3>
            <p>Estimated breakdown based on current parameters.</p>
            <div className="loan-summary-highlight">
              <span>Monthly Payment</span>
              <strong>
                {money(summary.monthlyPayment)} <em>/ month</em>
              </strong>
            </div>
          </div>
          <ul className="loan-summary-list">
            <li>
              <span>Principal Amount</span>
              <b>{money(summary.principal)}</b>
            </li>
            <li>
              <span>Estimated Interest</span>
              <b>{money(summary.estimatedInterest)}</b>
            </li>
            <li className="loan-summary-total">
              <span>Total Repayment</span>
              <b>{money(summary.totalRepayment)}</b>
            </li>
          </ul>
        </div>
      </div>
      <div className="assessment-footer-split">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <div className="loan-details-footer-actions">
          <Button variant="secondary">Save Draft</Button>
          <Button onClick={onNext}>
            Next: Calculate Risk <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
export { LoanDetailsStep };
