import { httpClient } from "./httpClient";

const BASE = "/v1/loans";

const LOAN_TYPE_TO_LABEL = { AUTO: "Auto Loan", CONSO: "Consumer Loan" };
// Two different forms produce loan type labels today (the quick Add Loan
// form vs. the New Loan Assessment wizard) — both map onto the same enum.
const LOAN_TYPE_FROM_LABEL = {
  "Auto Loan": "AUTO",
  "Automobile (AUTO)": "AUTO",
  "Consumer Loan": "CONSO",
  "Consumer (CONSO)": "CONSO",
};
const STATUS_TO_LABEL = {
  PENDING: "Pending",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  REJECTED: "Rejected",
};
const STATUS_FROM_LABEL = {
  Pending: "PENDING",
  Active: "ACTIVE",
  Completed: "COMPLETED",
  Rejected: "REJECTED",
};

// Loans are identified by their technical id (the API has no loan
// reference, unlike Client) — `reference` below is a frontend-only display
// label, not something sent back to the API.
function fromDTO(dto) {
  return {
    id: dto.id,
    reference: `LN-${dto.id}`,
    clientId: dto.clientReference,
    type: LOAN_TYPE_TO_LABEL[dto.loanType] || dto.loanType,
    amount: dto.loanAmount,
    duration: dto.duration,
    rate: dto.annualInterestRate,
    monthlyPayment: dto.monthlyPayment,
    risk: dto.riskLevel || null,
    status: STATUS_TO_LABEL[dto.status] || dto.status,
    startDate: dto.approvalDate ? dto.approvalDate.slice(0, 10) : null,
    endDate: dto.endDate ? dto.endDate.slice(0, 10) : null,
    rejectionReason: dto.rejectionReason,
    // Not tracked by the Loan API itself (derived from Payment records
    // instead) — kept so existing loanStats()/UI code that reads
    // loan.repaid doesn't break.
    repaid: 0,
  };
}

function toCreatePayload(values) {
  return {
    clientReference: values.clientId,
    loanType: LOAN_TYPE_FROM_LABEL[values.type] || values.type,
    loanAmount: Number(values.amount),
    duration: Number(values.duration),
    annualInterestRate: Number(values.rate),
    monthlyPayment:
      values.monthlyPayment != null ? Number(values.monthlyPayment) : null,
    riskLevel: values.risk || null,
    score: values.score != null ? Number(values.score) : null,
    status: STATUS_FROM_LABEL[values.status] || values.status || "PENDING",
    approvalDate: new Date().toISOString(),
    rejectionReason: values.rejectionReason || null,
  };
}

// Partial update: only the fields actually present in `values` are sent, so
// e.g. an approve/reject decision (status + rejectionReason only) never
// wipes out the loan's amount/duration/rate on the backend.
function toUpdatePayload(values) {
  const payload = {};
  if (values.type !== undefined) {
    payload.loanType = LOAN_TYPE_FROM_LABEL[values.type] || values.type;
  }
  if (values.amount !== undefined) payload.loanAmount = Number(values.amount);
  if (values.duration !== undefined) payload.duration = Number(values.duration);
  if (values.rate !== undefined) {
    payload.annualInterestRate = Number(values.rate);
  }
  if (values.monthlyPayment !== undefined) {
    payload.monthlyPayment = Number(values.monthlyPayment);
  }
  if (values.status !== undefined) {
    payload.status = STATUS_FROM_LABEL[values.status] || values.status;
  }
  if (values.rejectionReason !== undefined) {
    payload.rejectionReason = values.rejectionReason;
  }
  return payload;
}

export const loanService = {
  list: () => httpClient.get(BASE).then((res) => res.data.map(fromDTO)),
  // No single-loan GET exists on the backend — fetch the list and pick one
  // client-side rather than adding yet another endpoint for this data scale.
  get: (id) =>
    httpClient.get(BASE).then((res) => {
      const match = res.data.find((dto) => String(dto.id) === String(id));
      return match ? fromDTO(match) : null;
    }),
  listByClientReference: (reference) =>
    httpClient
      .get(`${BASE}/client/reference/${reference}`)
      .then((res) => res.data.map(fromDTO)),
  // The authenticated client's own loans — derived server-side from the
  // JWT, never from a client-supplied reference.
  listMine: () => httpClient.get(`${BASE}/me`).then((res) => res.data.map(fromDTO)),
  create: (values) =>
    httpClient
      .post(BASE, toCreatePayload(values))
      .then((res) => fromDTO(res.data)),
  update: (id, values) =>
    httpClient
      .put(`${BASE}/${id}`, toUpdatePayload(values))
      .then((res) => fromDTO(res.data)),
  remove: (id) => httpClient.delete(`${BASE}/${id}`).then(() => undefined),
};
export default loanService;
