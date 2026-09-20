import { Check } from "lucide-react";

const STEPS = ["Select Client", "Loan Details", "Risk Assessment", "Decision"];

export default function NewLoanStepper({ step }) {
  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;
  return (
    <div className="assessment-stepper">
      <div className="assessment-stepper-line" />
      <div
        className="assessment-stepper-line assessment-stepper-line-fill"
        style={{ width: `${progressPct}%` }}
      />
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const status =
          stepNumber < step
            ? "done"
            : stepNumber === step
              ? "active"
              : "upcoming";
        return (
          <div className={`assessment-step ${status}`} key={label}>
            <span className="assessment-step-dot">
              {status === "done" ? <Check size={16} /> : stepNumber}
            </span>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
export { NewLoanStepper };
