import { httpClient } from "./httpClient";

// Same rule as the backend's RiskServiceImpl.levelFor(): the model's own
// "RISQUE_ELEVE" verdict is always HIGH; a "RISQUE_FAIBLE" one is LOW under
// 30 %, MEDIUM otherwise. Only used when the response carries no riskLevel
// (e.g. a backend not yet restarted on the version that sends it) — the UI
// must never show "undefined".
const HIGH_RISK_DECISION = "RISQUE_ELEVE";
const MEDIUM_RISK_THRESHOLD = 0.3;

function levelFor(decision, probability) {
  if (decision === HIGH_RISK_DECISION) return "HIGH";
  return probability < MEDIUM_RISK_THRESHOLD ? "LOW" : "MEDIUM";
}

export const riskService = {
  // { amount, duration, rate } are the loan terms; monthlyIncome is the
  // applicant's — monthlyPayment is computed by the caller via
  // loanSummary() before calling this. The model was trained on a monthly
  // income figure (see ml-model/app.py), not Client.annualIncome — callers
  // must divide by 12 before passing it in here.
  calculate: ({ monthlyIncome, monthlyPayment, duration, annualInterestRate }) =>
    httpClient
      .post("/v1/risk-assesments/calculate-risk", {
        monthlyIncome,
        monthlyPayment,
        duration,
        annualInterestRate,
      })
      .then((res) => {
        // The backend serializes this field as "score_risque" (see
        // RiskPredictionResponseDTO), not the camelCase "scoreRisk".
        const probability = Number(res.data.score_risque) || 0; // 0..1, kept as-is for submission to the backend
        // Percentage with one decimal — a whole-number round turned every
        // score under 0.5 % into a misleading "0%".
        const score = Math.round(probability * 1000) / 10;
        return {
          score,
          // What the UI shows: a tiny but non-zero probability (the model
          // often returns values like 5e-13) reads "< 0.1%", not "0%".
          scoreLabel:
            probability > 0 && score < 0.1 ? "< 0.1%" : `${score}%`,
          probability,
          // LOW/MEDIUM/HIGH is derived by the backend (RiskServiceImpl)
          // from the model's decision + score — a "RISQUE_ELEVE" verdict is
          // always HIGH, so the level can never contradict the decision.
          level: res.data.riskLevel || levelFor(res.data.decision, probability),
          decision: res.data.decision,
        };
      }),
};
export default riskService;
