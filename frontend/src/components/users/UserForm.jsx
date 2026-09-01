import { useState } from "react";
import { Input, Select } from "../ui";

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "BANK_AGENT",
  status: "Active",
  tempPassword: "",
};

export default function UserForm({ formId, user, editing, onSubmit }) {
  const [form, setForm] = useState(user ? { ...EMPTY, ...user } : EMPTY);
  const [errors, setErrors] = useState({});
  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    const required = editing
      ? ["firstName", "lastName", "email", "phone", "role", "status"]
      : ["firstName", "lastName", "email", "phone", "role", "tempPassword"];
    const nextErrors = {};
    required.forEach((key) => {
      if (!form[key]) nextErrors[key] = "Required";
    });
    if (Object.keys(nextErrors).length) return setErrors(nextErrors);
    // The temporary password is never persisted — this is a frontend-only
    // simulation, not a real credential-issuing flow.
    const { tempPassword, ...values } = form;
    onSubmit(values);
  };
  return (
    <form className="form-grid" id={formId} onSubmit={submit}>
      <Input
        name="firstName"
        label="First Name"
        value={form.firstName}
        error={errors.firstName}
        onChange={change}
      />
      <Input
        name="lastName"
        label="Last Name"
        value={form.lastName}
        error={errors.lastName}
        onChange={change}
      />
      <Input
        name="email"
        type="email"
        label="Email"
        value={form.email}
        error={errors.email}
        onChange={change}
      />
      <Input
        name="phone"
        label="Phone"
        value={form.phone}
        error={errors.phone}
        onChange={change}
      />
      <Select name="role" label="Role" value={form.role} onChange={change}>
        <option value="BANK_AGENT">Bank Agent</option>
        <option value="ADMIN">Administrator</option>
      </Select>
      {editing ? (
        <Select
          name="status"
          label="Status"
          value={form.status}
          onChange={change}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      ) : (
        <Input
          name="tempPassword"
          type="password"
          label="Temporary Password"
          value={form.tempPassword}
          error={errors.tempPassword}
          onChange={change}
        />
      )}
    </form>
  );
}
export { UserForm };
