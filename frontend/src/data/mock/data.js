import { loanSummary } from "../../utils/finance";

// How many of LN-1042's 48 monthly installments are already paid — kept as
// a single constant so the loan's `repaid` total and its generated payment
// schedule can never drift out of sync with each other.
const LN_1042_PAID_INSTALLMENTS = 20;
const LN_1042_MONTHLY_PAYMENT = loanSummary(42500, 48, 4.2).monthlyPayment;

export const clients = [
  {
    id: "CLI-9824-A",
    name: "Mohcine Lamtanez",
    city: "Casablanca",
    postalCode: "20000",
    income: 185000,
    totalAssets: 1250000,
    status: "Actif",
    email: "mohcine.lamtanez@example.ma",
  },
  {
    id: "CLI-1049-B",
    name: "Salma Bennani",
    city: "Rabat",
    postalCode: "10000",
    income: 142000,
    totalAssets: 452000.5,
    status: "Actif",
    email: "salma.bennani@example.ma",
  },
  {
    id: "CLI-2317-C",
    name: "Youssef El Amrani",
    city: "Marrakech",
    postalCode: "40000",
    income: 220000,
    totalAssets: 8900000,
    status: "Actif",
    email: "youssef.elamrani@example.ma",
  },
  {
    id: "CLI-4401-D",
    name: "Nadia Ait Lahcen",
    city: "Agadir",
    postalCode: "80000",
    income: 96000,
    totalAssets: 12050,
    status: "Inactif",
    email: "nadia.aitlahcen@example.ma",
  },
  {
    id: "CLI-7730-E",
    name: "Rachid Tazi",
    city: "Fès",
    postalCode: "30000",
    income: 128000,
    totalAssets: 305400,
    status: "Inactif",
    email: "rachid.tazi@example.ma",
  },
];
export const loans = [
  {
    id: "LN-1042",
    clientId: "CLI-9824-A",
    type: "Consumer Loan",
    amount: 42500,
    rate: 4.2,
    duration: 48,
    risk: "LOW",
    status: "Active",
    startDate: "2024-10-01",
    endDate: "2028-10-01",
    repaid:
      Math.round(LN_1042_MONTHLY_PAYMENT * LN_1042_PAID_INSTALLMENTS * 100) /
      100,
  },
  {
    id: "LN-0928",
    clientId: "CLI-9824-A",
    type: "Auto Loan",
    amount: 120000,
    rate: 3.9,
    duration: 60,
    risk: "MEDIUM",
    status: "Completed",
    startDate: "2019-03-01",
    endDate: "2024-03-01",
    repaid: 120000,
  },
  {
    id: "LN-1186",
    clientId: "CLI-1049-B",
    type: "Consumer Loan",
    amount: 28000,
    rate: 5.4,
    duration: 36,
    risk: "HIGH",
    status: "Rejected",
    startDate: "2025-06-09",
    endDate: null,
    repaid: 0,
    rejectionReason: "Insufficient application information.",
  },
  {
    id: "LN-1219",
    clientId: "CLI-2317-C",
    type: "Auto Loan",
    amount: 198000,
    rate: 4.7,
    duration: 72,
    risk: "MEDIUM",
    status: "Pending",
    startDate: "2026-07-02",
    endDate: null,
    repaid: 0,
  },
  {
    id: "LN-0981",
    clientId: "CLI-4401-D",
    type: "Consumer Loan",
    amount: 18000,
    rate: 4.8,
    duration: 24,
    risk: "LOW",
    status: "Completed",
    startDate: "2023-01-01",
    endDate: "2025-01-01",
    repaid: 18000,
  },
];
// Payment status is intentionally a separate vocabulary from loan status
// (PENDING / PAID vs. the loan's Active / Completed / Rejected) — a loan
// stays Active until every one of its payments is PAID. OVERDUE/DUE are not
// stored here at all: they're derived from `dueDate` vs. "today" wherever a
// payment is displayed (see utils/paymentSchedule.js), so an unpaid
// installment naturally drifts from PENDING -> DUE -> OVERDUE over time
// without any code needing to flip a stored flag.
function addMonths(isoDate, count) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + count, day))
    .toISOString()
    .slice(0, 10);
}

// Simulates a loan generating its own repayment schedule from its
// duration — a 48-month loan really does produce 48 monthly installments
// here, even though the UI (Payment History) only ever surfaces a bounded,
// relevant slice of them.
function generateSchedule(loan, paidInstallments) {
  const amount = Math.round(
    loanSummary(loan.amount, loan.duration, loan.rate).monthlyPayment * 100,
  ) / 100;
  const idBase = loan.id.replace("LN-", "PAY-");
  return Array.from({ length: loan.duration }, (_, index) => {
    const installment = index + 1;
    const dueDate = addMonths(loan.startDate, installment);
    const isPaid = installment <= paidInstallments;
    return {
      id: `${idBase}-${String(installment).padStart(2, "0")}`,
      loanId: loan.id,
      amount,
      dueDate,
      date: isPaid ? dueDate : null,
      status: isPaid ? "PAID" : "PENDING",
      note: isPaid ? "Monthly installment" : "Upcoming monthly installment",
    };
  });
}

export const payments = [
  // LN-1042 is the only Active loan (48 installments; the rest are still
  // PENDING and will surface as DUE/OVERDUE over time as their due dates
  // pass without a Mark as Paid confirmation).
  ...generateSchedule(
    loans.find((loan) => loan.id === "LN-1042"),
    LN_1042_PAID_INSTALLMENTS,
  ),
  // Completed loans are fully repaid — every installment is PAID.
  ...generateSchedule(loans.find((loan) => loan.id === "LN-0928"), 60),
  ...generateSchedule(loans.find((loan) => loan.id === "LN-0981"), 24),
];
export const notifications = [
  {
    id: 1,
    title: "New loan added",
    text: "Youssef El Amrani submitted an Auto Loan request.",
    time: "10 min ago",
    kind: "loan",
    unread: true,
  },
  {
    id: 2,
    title: "Loan approved",
    text: "LN-1042 is active and payment scheduling is available.",
    time: "2 hours ago",
    kind: "approved",
    unread: true,
  },
  {
    id: 3,
    title: "Repayment event",
    text: "A payment for LN-1042 was recorded.",
    time: "Yesterday",
    kind: "payment",
  },
  {
    id: 4,
    title: "Security event",
    text: "A security audit entry needs review.",
    time: "2 days ago",
    kind: "security",
  },
];
