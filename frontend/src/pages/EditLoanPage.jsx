import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Card,
  Input,
  LoadingState,
  Select,
} from "../components/ui";
import { clients } from "../data/mock/data";
import { useLoan } from "../hooks/useLoans";
import { loanService } from "../services/loanService";
import { money, loanSummary } from "../utils/finance";
import { PageHeading } from "./pageShared";
export default function EditLoanPage() {
  const navigate = useNavigate();
  const { loanId } = useParams();
  const editing = Boolean(loanId);
  const { loading, data } = useLoan(loanId);
  const [form, setForm] = useState(null);
  useEffect(
    () =>
      setForm(
        editing
          ? data
          : {
              clientId: clients[0].id,
              type: "Consumer Loan",
              amount: "",
              rate: "",
              duration: "",
              risk: "LOW",
              status: "Pending",
            },
      ),
    [data, editing],
  );
  if ((editing && loading) || !form) return <LoadingState />;
  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const save = async (event) => {
    event.preventDefault();
    const values = {
      ...form,
      amount: Number(form.amount),
      rate: Number(form.rate),
      duration: Number(form.duration),
    };
    if (editing) await loanService.update(loanId, values);
    else
      await loanService.create({
        ...values,
        id: `LN-${Date.now().toString().slice(-4)}`,
        startDate: new Date().toISOString().slice(0, 10),
        repaid: 0,
      });
    navigate("/loans");
  };
  const summary = loanSummary(form.amount, form.duration, form.rate);
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Loans", to: "/loans" },
          { label: editing ? "Edit loan" : "Add loan" },
        ]}
      />
      <PageHeading
        title={editing ? "Edit Loan" : "Add Loan"}
        subtitle="Enter the loan details."
      />
      <Card className="form-card">
        <form className="form-grid" onSubmit={save}>
          <Select
            label="Client"
            name="clientId"
            value={form.clientId}
            onChange={change}
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
          <Select
            label="Loan type"
            name="type"
            value={form.type}
            onChange={change}
          >
            <option>Auto Loan</option>
            <option>Consumer Loan</option>
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
            value={form.risk}
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
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button>{editing ? "Save changes" : "Create loan"}</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
