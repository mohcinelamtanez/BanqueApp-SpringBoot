import { httpClient } from "./httpClient";

// The Flask model only returns a binary decision (RISQUE_ELEVE/FAIBLE) plus
// a continuous 0..1 risk probability — it has no notion of a LOW/MEDIUM/HIGH
// tier. These thresholds bucket that probability into the 3-tier RiskLevel
// the rest of the app (and the backend's RiskAssessment) already expects.
function bucketLevel(score) {
  if (score < 30) return "LOW";
  if (score < 55) return "MEDIUM";
  return "HIGH";
}

export const riskService = {
  // { amount, duration, rate } are the loan terms; annualIncome is the
  // applicant's — monthlyPayment is computed by the caller via
  // loanSummary() before calling this.
  calculate: ({ annualIncome, monthlyPayment, duration, annualInterestRate }) =>
    httpClient
      .post("/v1/risk-assesments/calculate-risk", {
        annualIncome,
        monthlyPayment,
        duration,
        annualInterestRate,
      })
      .then((res) => {
        // The backend serializes this field as "score_risque" (see
        // RiskPredictionResponseDTO), not the camelCase "scoreRisk".
        const probability = Number(res.data.score_risque) || 0; // 0..1, kept as-is for submission to the backend
        // No artificial floor/ceiling — display exactly what the model
        // returned, even if that's 0% or 100%.
        const score = Math.round(probability * 100);
        return {
          score,
          probability,
          level: bucketLevel(score),
          decision: res.data.decision,
        };
      }),
};
export default riskService;
