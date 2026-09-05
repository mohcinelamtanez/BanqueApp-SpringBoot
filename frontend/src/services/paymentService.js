import { httpClient } from "./httpClient";

const BASE = "/v1/payments";

// Payments are identified by their technical id (mark-paid/mark-unpaid are
// id-based, there's no reference-based endpoint) — `reference` is only a
// frontend display label, same pattern as Loan.
function fromDTO(dto) {
  return {
    id: dto.id,
    reference: dto.paymentReference || `PAY-${dto.id}`,
    loanId: dto.loanId,
    amount: dto.amount,
    dueDate: dto.dueDate,
    date: dto.paymentDate,
    // Backend already derives OVERDUE from the due date (see PaymentMapper)
    // — everything downstream here only ever checks `=== "PAID"` and treats
    // any other value as "not yet paid", so OUTSTANDING/OVERDUE both flow
    // through untranslated.
    status: dto.status,
    note: dto.description,
  };
}

export const paymentService = {
  list: (loanId) =>
    httpClient
      .get(`${BASE}/loan/${loanId}`)
      .then((res) => res.data.map(fromDTO)),
  // The authenticated client's own payments, across all of their loans —
  // derived server-side from the JWT, never from a client-supplied id.
  listMine: () => httpClient.get(`${BASE}/me`).then((res) => res.data.map(fromDTO)),
  markPaid: (id) =>
    httpClient.put(`${BASE}/${id}/mark-paid`).then((res) => fromDTO(res.data)),
  markUnpaid: (id) =>
    httpClient
      .put(`${BASE}/${id}/mark-unpaid`)
      .then((res) => fromDTO(res.data)),
};
export default paymentService;
