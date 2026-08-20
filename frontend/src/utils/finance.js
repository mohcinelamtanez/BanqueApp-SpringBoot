export const money = value => new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 2 }).format(value || 0)
export const date = value => value ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value)) : '—'
export function loanSummary(amount = 0, months = 0, annualRate = 0) {
  const principal = Number(amount) || 0, term = Number(months) || 0, monthlyRate = (Number(annualRate) || 0) / 1200
  const monthlyPayment = !term ? 0 : !monthlyRate ? principal / term : principal * monthlyRate * Math.pow(1 + monthlyRate, term) / (Math.pow(1 + monthlyRate, term) - 1)
  const totalRepayment = monthlyPayment * term
  return { monthlyPayment, principal, estimatedInterest: totalRepayment - principal, totalRepayment }
}
