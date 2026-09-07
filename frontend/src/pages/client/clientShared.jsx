import { getUser } from "../../auth/authStore";

// Resolves to the clientReference of whichever Client the currently
// logged-in CLIENT-role user is linked to (set by AuthController at login).
// A function, not a constant, so it always reflects whoever is actually
// authenticated right now rather than a fixed stand-in.
export function getCurrentClientId() {
  return getUser()?.clientReference ?? null;
}

// DUE/OVERDUE are derived (see utils/paymentSchedule.js), never stored —
// labels below cover every status getPaymentStatus() can return, relabeled
// for the client-facing tone.
export const PAYMENT_STATUS_LABEL = {
  PAID: "Paid",
  PENDING: "Upcoming",
  DUE: "Due",
  OVERDUE: "Overdue",
};
