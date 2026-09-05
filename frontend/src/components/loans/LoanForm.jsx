import { useState } from "react";
import { Input, Select } from "../ui";
import { money, loanSummary } from "../../utils/finance";

const LOAN_TYPES = ["Auto Loan", "Consumer Loan"];

function buildEmptyForm(clientId) {
  return {
    clientId: clientId || "",
    type: LOAN_TYPES[1],
    amount: "",
    rate: "",
    duration: "",
    risk: "LOW",
    // This form creates a Loan record directly (not a LoanApplication
    // awaiting review) — "Pending" is not a valid Loan status.
    status: "Active",
  };
}

export default function LoanForm({
  formId,
  loan,
  clients = [],
  lockedClient,
  onSubmit,
}) {
  const editing = Boolean(loan);
  const [form, setForm] = useState(
    loan || buildEmptyForm(lockedClient?.id || clients[0]?.id),
  );
  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const amount = Number(form.amount);
    const rate = Number(form.rate);
    const duration = Number(form.duration);
    onSubmit({
      ...form,
      amount,
      rate,
      duration,
      // The backend's payment schedule generator uses this directly as
      // each installment's amount — without it, a loan created here would
      // get a null-amount payment schedule once approved.
      monthlyPayment: loanSummary(amount, duration, rate).monthlyPayment,
    });
  };
  const summary = loanSummary(form.amount, form.duration, form.rate);
  const clientLocked = editing || Boolean(lockedClient);
  return (
    <form className="form-grid" id={formId} onSubmit={submit}>
      <Select
        label="Client"
        name="clientId"
        value={form.clientId}
        onChange={change}
        disabled={clientLocked}
      >
        {lockedClient ? (
          <option value={lockedClient.id}>{lockedClient.name}</option>
        ) : (
          clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))
        )}
      </Select>
      <Select label="Loan type" name="type" value={form.type} onChange={change}>
        {LOAN_TYPES.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </Select>
      <Input
        label="Requested amount (MAD)"
        name="amount"
        type="number"
        min="1"
        required
        value={form.amount}
        onChange={change}
      />
      <Input
        label="Duration (months)"
        name="duration"
        type="number"
        min="1"
        required
        value={form.duration}
        onChange={change}
      />
      <Input
        label="Annual interest rate (%)"
        name="rate"
        type="number"
        min="0"
        step="0.1"
        required
        value={form.rate}
        onChange={change}
      />
      <Select
        label="Risk level"
        name="risk"
        value={form.risk || "LOW"}
        onChange={change}
      >
        <option>LOW</option>
        <option>MEDIUM</option>
        <option>HIGH</option>
      </Select>
      <div className="finance-preview">
        <b>Financial summary</b>
        <span>Monthly payment: {money(summary.monthlyPayment)}</span>
        <span>Total repayment: {money(summary.totalRepayment)}</span>
      </div>
    </form>
  );
}
export { LoanForm };
