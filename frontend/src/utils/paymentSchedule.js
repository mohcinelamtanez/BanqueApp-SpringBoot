import { money, date as formatDate } from "./finance";

// A payment's persisted status is only ever "PAID" or "PENDING" — OVERDUE
// and DUE are derived from today's date vs. the due date, never stored, so
// an unpaid installment naturally "becomes" overdue over time without any
// extra state transition to simulate.
export function getPaymentStatus(payment, today = new Date()) {
  if (payment.status === "PAID") return "PAID";
  const todayStr = today.toISOString().slice(0, 10);
  if (payment.dueDate < todayStr) return "OVERDUE";
  if (payment.dueDate === todayStr) return "DUE";
  return "PENDING";
}

export function withDisplayStatus(payments, today = new Date()) {
  return payments.map((payment) => ({
    ...payment,
    displayStatus: getPaymentStatus(payment, today),
  }));
}

// The date Payment History sorts by: the actual Payment Date once a payment
// has been made, otherwise its Due Date (for UPCOMING/DUE/OVERDUE, nothing
// has happened yet, so the due date is the only meaningful date to order by).
function effectiveDate(payment) {
  return payment.date || payment.dueDate;
}

// Keeps Payment History from ever rendering a full amortization table (a
// 48-month loan really does have 48 scheduled installments in the mock
// data) — shows every payment that already happened or matters right now,
// plus a short, chronologically-nearest preview of what's still upcoming.
// Rows are always ordered most-recent-first (see effectiveDate above).
export function visiblePaymentRows(payments, { previewUpcoming = 3 } = {}) {
  const withStatus = withDisplayStatus(payments);
  const actionable = withStatus.filter((p) => p.displayStatus !== "PENDING");
  const upcoming = withStatus
    .filter((p) => p.displayStatus === "PENDING")
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
  const preview = upcoming.slice(0, previewUpcoming);
  const hiddenUpcomingCount = upcoming.length - preview.length;
  const visible = [...actionable, ...preview].sort((a, b) =>
    effectiveDate(a) < effectiveDate(b) ? 1 : -1,
  );
  return { visible, hiddenUpcomingCount, all: withStatus };
}

// "Amount Due" = everything currently due today or already overdue — never
// includes future installments, and never adds late fees/interest (none of
// that is modeled in this MVP simulation).
export function amountDue(withStatusPayments) {
  const due = withStatusPayments.filter(
    (p) => p.displayStatus === "DUE" || p.displayStatus === "OVERDUE",
  );
  return {
    total: due.reduce((sum, p) => sum + p.amount, 0),
    count: due.length,
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Frontend-only simulation of the reminder emails/pushes a real client would
// receive — no notification is actually sent anywhere, this only feeds the
// existing NotificationCenter UI.
export function buildPaymentNotifications(loan, payments, today = new Date()) {
  if (!loan || !payments.length) return [];
  const withStatus = withDisplayStatus(payments, today);
  const overdue = withStatus
    .filter((p) => p.displayStatus === "OVERDUE")
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));
  const dueToday = withStatus.find((p) => p.displayStatus === "DUE");
  const nextUpcoming = withStatus
    .filter((p) => p.displayStatus === "PENDING")
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1))[0];

  const items = [];
  if (overdue.length > 1) {
    items.push({
      id: `notif-${loan.id}-overdue-escalation`,
      title: "Payment still overdue",
      text: "Your payment is still overdue. Please contact your branch.",
      time: "Recurring",
      kind: "payment",
      unread: true,
    });
  } else if (overdue.length === 1) {
    items.push({
      id: `notif-${overdue[0].id}-overdue`,
      title: "Payment overdue",
      text: `Your payment of ${money(overdue[0].amount)} is overdue.`,
      time: "Today",
      kind: "payment",
      unread: true,
    });
  }
  if (dueToday) {
    items.push({
      id: `notif-${dueToday.id}-due-today`,
      title: "Payment due today",
      text: `Your payment of ${money(dueToday.amount)} is due today.`,
      time: "Today",
      kind: "payment",
      unread: true,
    });
  } else if (nextUpcoming) {
    const daysUntil = (new Date(nextUpcoming.dueDate) - today) / DAY_MS;
    if (daysUntil <= 30) {
      items.push({
        id: `notif-${nextUpcoming.id}-reminder`,
        title: "Payment reminder",
        text: `Your payment of ${money(nextUpcoming.amount)} is due on ${formatDate(nextUpcoming.dueDate)}.`,
        time: "Upcoming",
        kind: "payment",
        unread: false,
      });
    }
  }
  return items;
}
