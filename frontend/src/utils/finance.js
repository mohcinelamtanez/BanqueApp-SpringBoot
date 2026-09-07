export const money = (value) =>
  new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 2,
  }).format(value || 0);
export const date = (value) =>
  value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "—";
// Simplified flat-interest business rule (not amortization/reducing-balance):
// totalInterest = principal × (annualRate / 100) × (months / 12), then the
// monthly payment is the total repayment spread evenly over the term.
export function loanSummary(amount = 0, months = 0, annualRate = 0) {
  const principal = Number(amount) || 0;
  const term = Number(months) || 0;
  const rate = Number(annualRate) || 0;
  const durationInYears = term / 12;
  const totalInterest = principal * (rate / 100) * durationInYears;
  const totalRepayment = principal + totalInterest;
  const monthlyPayment = term
    ? Math.round((totalRepayment / term) * 100) / 100
    : 0;
  return {
    monthlyPayment,
    principal,
    estimatedInterest: totalInterest,
    totalRepayment,
  };
}
// A Loan's end date is never stored — it's derived from its start date
// (the Admin/Bank Agent's decision date) plus its duration. A Rejected
// loan has no repayment period, so callers must not call this for one.
export function loanEndDate(startDate, months) {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setMonth(end.getMonth() + (Number(months) || 0));
  return end.toISOString().slice(0, 10);
}
