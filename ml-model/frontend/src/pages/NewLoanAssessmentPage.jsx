import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import { Button, LoadingState } from "../components/ui";
import ClientSelectionStep from "../components/loans/ClientSelectionStep";
import LoanDetailsStep from "../components/loans/LoanDetailsStep";
import RiskAssessmentStep from "../components/loans/RiskAssessmentStep";
import DecisionStep from "../components/loans/DecisionStep";
import NewLoanStepper from "../components/loans/NewLoanStepper";
import { useLoans } from "../hooks/useLoans";
import { useClients } from "../hooks/useClients";

const DEFAULT_LOAN_VALUES = {
  loanType: "Consumer (CONSO)",
  amount: 100000,
  duration: 48,
  rate: 4.2,
};

export default function NewLoanAssessmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get("clientId");
  const { loading: loansLoading, data: loans = [] } = useLoans();
  const { loading: clientsLoading, data: clients = [] } = useClients();
  const [step, setStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loanValues, setLoanValues] = useState(DEFAULT_LOAN_VALUES);
  const [riskResult, setRiskResult] = useState(null);

  // Client Details "Add loan" links here with ?clientId=<ref> so the user
  // isn't asked to search for a client they've already opened — resolve it
  // against the loaded client list once available and jump straight to
  // Loan Details. Falls back to normal manual selection if it doesn't
  // resolve to a known client.
  useEffect(() => {
    if (!preselectedClientId || clientsLoading || selectedClient) return;
    const match = clients.find(
      (client) => String(client.id) === String(preselectedClientId),
    );
    if (match) {
      setSelectedClient(match);
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedClientId, clientsLoading]);

  if (loansLoading || clientsLoading) return <LoadingState />;

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
            {step === 4 &&
              "Review the assessment and provide the final decision."}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/loans")}>
          <X size={16} /> Cancel Assessment
        </Button>
      </div>
      <NewLoanStepper step={step} />
      {step === 1 && (
        <ClientSelectionStep
          clients={clients}
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
          onNext={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <DecisionStep
          client={selectedClient}
          values={loanValues}
          risk={riskResult}
          loans={loans}
          onBack={() => setStep(3)}
        />
      )}
    </div>
  );
}
