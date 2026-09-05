import { httpClient } from "./httpClient";

const BASE = "/v1/applications";

const LOAN_TYPE_TO_LABEL = { AUTO: "Auto Loan", CONSO: "Consumer Loan" };
const LOAN_TYPE_FROM_LABEL = {
  "Auto Loan": "AUTO",
  "Consumer Loan": "CONSO",
};
// The backend's ApplicationStatus enum is PENDING/APPROVED/REJECTED — the
// same 3-tier model the UI expects, just in a different case.
const STATUS_TO_LABEL = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};
const STATUS_FROM_LABEL = {
  Pending: "PENDING",
  Approved: "APPROVED",
  Rejected: "REJECTED",
};

function fromDTO(dto) {
  return {
    id: dto.id,
    reference: `APP-${dto.id}`,
    clientId: dto.clientReference,
    type: LOAN_TYPE_TO_LABEL[dto.loanType] || dto.loanType,
    amount: dto.requestedAmount,
    duration: dto.requestedDuration,
    submittedDate: dto.applicationDate,
    status: STATUS_TO_LABEL[dto.status] || dto.status,
    rejectionReason: dto.rejectionReason,
  };
}

function toCreatePayload(values) {
  return {
    loanType: LOAN_TYPE_FROM_LABEL[values.type] || values.type,
    requestedAmount: Number(values.amount),
    requestedDuration: Number(values.duration),
  };
}

// Approving requires the loan terms being granted (rate/monthly payment/
// risk) — the same fields LoanCreateDto already expects, since approving
// results in a real Loan via the existing Loan feature. Rejecting only
// needs a reason.
function toDecisionPayload({ status, rejectionReason, rate, monthlyPayment, risk, score }) {
  return {
    status: STATUS_FROM_LABEL[status] || status,
    rejectionReason: rejectionReason || null,
    annualInterestRate: rate != null && rate !== "" ? Number(rate) : null,
    monthlyPayment: monthlyPayment != null ? Number(monthlyPayment) : null,
    riskLevel: risk || null,
    score: score != null ? Number(score) : null,
  };
}

export const applicationService = {
  // The submitting/reading client is always derived server-side from the
  // authenticated user — never sent from here.
  listMine: () =>
    httpClient.get(`${BASE}/me`).then((res) => res.data.map(fromDTO)),
  // Admin/Bank Agent only — the full review queue (Application Management).
  list: () => httpClient.get(BASE).then((res) => res.data.map(fromDTO)),
  // No single-application GET exists on the backend — same pattern as
  // Loan: fetch the list and pick one client-side.
  get: (id) =>
    httpClient.get(BASE).then((res) => {
      const match = res.data.find((dto) => String(dto.id) === String(id));
      return match ? fromDTO(match) : null;
    }),
  create: (values) =>
    httpClient
      .post(BASE, toCreatePayload(values))
      .then((res) => fromDTO(res.data)),
  decide: (id, values) =>
    httpClient
      .put(`${BASE}/${id}/decision`, toDecisionPayload(values))
      .then((res) => fromDTO(res.data)),
};
export default applicationService;
