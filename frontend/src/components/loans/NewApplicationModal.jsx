import { useState } from "react";
import { Button, Input, Modal, Select } from "../ui";
import { loanService } from "../../services/loanService";
import { CURRENT_CLIENT_ID } from "../../pages/client/clientShared";

const LOAN_TYPES = ["Consumer Loan", "Auto Loan"];

export default function NewApplicationModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    type: LOAN_TYPES[0],
    amount: "",
    duration: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!(Number(form.amount) > 0)) nextErrors.amount = "Enter a valid amount";
    if (!(Number(form.duration) > 0))
      nextErrors.duration = "Enter a valid duration";
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    setErrors({});
    setSubmitting(true);
    await loanService.create({
      id: `LN-${Date.now().toString().slice(-4)}`,
      clientId: CURRENT_CLIENT_ID,
      type: form.type,
      amount: Number(form.amount),
      duration: Number(form.duration),
      rate: 0,
      status: "Pending",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: null,
      repaid: 0,
    });
    setSubmitting(false);
    onCreated();
  };

  return (
    <Modal
      title="New Loan Application"
      onClose={submitting ? undefined : onClose}
    >
      <form className="stack-gap" onSubmit={submit}>
        <Select
          label="Loan type"
          value={form.type}
          onChange={(event) => setForm({ ...form, type: event.target.value })}
        >
          {LOAN_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </Select>
        <Input
          label="Requested amount (MAD)"
          type="number"
          min="1"
          value={form.amount}
          error={errors.amount}
          onChange={(event) =>
            setForm({ ...form, amount: event.target.value })
          }
        />
        <Input
          label="Duration (months)"
          type="number"
          min="1"
          value={form.duration}
          error={errors.duration}
          onChange={(event) =>
            setForm({ ...form, duration: event.target.value })
          }
        />
        <p className="decision-note">
          Your application will be submitted for review. A bank administrator
          will assess your request and notify you once a decision has been
          made.
        </p>
        <div className="form-actions">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Application"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
export { NewApplicationModal };
