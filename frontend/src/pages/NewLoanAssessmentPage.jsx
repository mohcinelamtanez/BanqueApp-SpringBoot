import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button, LoadingState } from "../components/ui";
import ClientSelectionStep from "../components/loans/ClientSelectionStep";
import LoanDetailsStep from "../components/loans/LoanDetailsStep";
import RiskAssessmentStep from "../components/loans/RiskAssessmentStep";
import NewLoanStepper from "../components/loans/NewLoanStepper";
import { useLoans } from "../hooks/useLoans";
import { clients } from "../data/mock/data";

const DEFAULT_LOAN_VALUES = {
  loanType: "Consumer (CONSO)",
  amount: 100000,
  duration: 48,
  rate: 4.2,
};

export default function NewLoanAssessmentPage() {
  const navigate = useNavigate();
  const { loading, data: loans = [] } = useLoans();
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState(clients[0] || null);
  const [loanValues, setLoanValues] = useState(DEFAULT_LOAN_VALUES);
  const [riskResult, setRiskResult] = useState(null);

  if (loading) return <LoadingState />;

  const updateLoanValues = (patch) =>
    setLoanValues((current) => ({ ...current, ...patch }));

  return (
    <div className="assessment">
      <div className="assessment-header">
        <div>
          <h1>New Loan Assessment</h1>
          <p>
            {step === 1 &&
              "Initiate a new borrowing request and evaluate client eligibility."}
            {step === 2 &&
              `Configure the loan terms for ${selectedClient?.name || "the selected client"}.`}
            {step === 3 &&
              `Review the algorithmic risk assessment for ${selectedClient?.name || "the selected client"}.`}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/loans")}>
          <X size={16} /> Cancel Assessment
        </Button>
      </div>
      <NewLoanStepper step={step} />
      {step === 1 && (
        <ClientSelectionStep
          loans={loans}
          selectedClient={selectedClient}
          onSelectClient={setSelectedClient}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <LoanDetailsStep
          values={loanValues}
          onChange={updateLoanValues}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <RiskAssessmentStep
          client={selectedClient}
          values={loanValues}
          result={riskResult}
          onResult={setRiskResult}
          onBack={() => setStep(2)}
          onNext={() => {}}
        />
      )}
    </div>
  );
}
