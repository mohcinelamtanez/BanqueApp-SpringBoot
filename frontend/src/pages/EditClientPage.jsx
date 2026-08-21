import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, Button, Card, EmptyState, Input } from "../components/ui";
import { clientService } from "../services/clientService";
import { getClient, PageHeading } from "./pageShared";
export default function EditClientPage() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const editing = Boolean(clientId);
  const [form, setForm] = useState(
    editing
      ? getClient(clientId)
      : { id: "", name: "", city: "", postalCode: "", income: "", email: "" },
  );
  const [errors, setErrors] = useState({});
  if (editing && !form) return <EmptyState title="Client not found" />;
  const change = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const save = async (event) => {
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
    editing
      ? await clientService.update(clientId, values)
      : await clientService.create(values);
    navigate(editing ? `/clients/${clientId}` : "/clients");
  };
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Clients", to: "/clients" },
          { label: editing ? "Edit client" : "Add client" },
        ]}
      />
      <PageHeading
        title={editing ? "Edit Client" : "Add Client"}
        subtitle="Keep client information accurate and up to date."
      />
      <Card className="form-card">
        <form className="form-grid" onSubmit={save}>
          {[
            ["name", "Client name"],
            ["id", "Client ID"],
            ["city", "City"],
            ["postalCode", "Postal code"],
            ["income", "Annual income (MAD)"],
            ["email", "Email"],
          ].map(([name, label]) => (
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
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button>{editing ? "Save changes" : "Create client"}</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
