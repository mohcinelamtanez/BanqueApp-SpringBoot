import { useState } from "react";
import { Input } from "../ui";

const FIELDS = [
  ["name", "Client name"],
  ["id", "Client ID"],
  ["city", "City"],
  ["postalCode", "Postal code"],
  ["income", "Annual income (MAD)"],
  ["email", "Email"],
];
const EMPTY = { id: "", name: "", city: "", postalCode: "", income: "", email: "" };

export default function ClientForm({ formId, client, editing, onSubmit }) {
  const [form, setForm] = useState(client || EMPTY);
  const [errors, setErrors] = useState({});
  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    ["id", "name", "city", "postalCode", "income"].forEach((key) => {
      if (!form[key]) nextErrors[key] = "Required";
    });
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    const values = {
      ...form,
      id: editing ? form.id : form.id.toUpperCase(),
      income: Number(form.income),
    };
    onSubmit(values);
  };
  return (
    <form className="form-grid" id={formId} onSubmit={submit}>
      {FIELDS.map(([name, label]) => (
        <Input
          key={name}
          name={name}
          label={label}
          type={
            name === "income"
              ? "number"
              : name === "email"
                ? "email"
                : "text"
          }
          disabled={editing && name === "id"}
          value={form[name]}
          error={errors[name]}
          onChange={change}
        />
      ))}
    </form>
  );
}
export { ClientForm };
