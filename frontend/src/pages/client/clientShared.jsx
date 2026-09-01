// Frontend-only stand-in for the authenticated client until real auth/roles
// are wired in. Every Client page filters the shared mock loans by this id.
export const CURRENT_CLIENT_ID = "CLI-9824-A";

// A loan application only reaches "Active"/"Completed" once an administrator
// has approved it — there is no separate stored "Approved" status in the
// data model, so both map to the client-facing APPROVED application state.
export function applicationStatus(loan) {
  if (loan.status === "Pending") return "PENDING";
  if (loan.status === "Rejected") return "REJECTED";
  return "APPROVED";
}

export const APPLICATION_STATUS_LABEL = {
  PENDING: "Pending",
  REJECTED: "Declined",
  APPROVED: "Approved",
};

// The mock payment records only ever carry these three statuses — labels are
// relabeled for the client-facing tone without inventing a fourth state.
export const PAYMENT_STATUS_LABEL = {
  Completed: "Paid",
  Outstanding: "Upcoming",
  Overdue: "Overdue",
};
