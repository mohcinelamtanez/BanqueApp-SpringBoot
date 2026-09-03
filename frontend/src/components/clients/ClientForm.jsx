import { useState } from "react";
import { Input } from "../ui";

const FIELDS = [
  ["firstName", "First name"],
  ["lastName", "Last name"],
  ["city", "City"],
  ["postalCode", "Postal code"],
  ["income", "Annual income (MAD)"],
  ["email", "Email"],
];
const EMPTY = {
  firstName: "",
  lastName: "",
  city: "",
  postalCode: "",
  income: "",
  email: "",
};

export default function ClientForm({ formId, client, onSubmit }) {
  const [form, setForm] = useState(client || EMPTY);
  const [errors, setErrors] = useState({});
  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    ["firstName", "lastName", "city", "postalCode", "income"].forEach(
      (key) => {
        if (!form[key]) nextErrors[key] = "Required";
      },
    );
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    const values = { ...form, income: Number(form.income) };
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
          value={form[name]}
          error={errors[name]}
          onChange={change}
        />
      ))}
    </form>
  );
}
export { ClientForm };
