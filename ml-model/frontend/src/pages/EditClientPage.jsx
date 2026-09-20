import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  LoadingState,
} from "../components/ui";
import ClientForm from "../components/clients/ClientForm";
import { clientService } from "../services/clientService";
import { useClient } from "../hooks/useClients";
import { PageHeading } from "./pageShared";
export default function EditClientPage() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const editing = Boolean(clientId);
  const { loading, data: client } = useClient(editing ? clientId : null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  if (editing && loading) return <LoadingState />;
  if (editing && !client) return <EmptyState title="Client not found" />;
  const save = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      editing
        ? await clientService.update(clientId, values)
        : await clientService.create(values);
      navigate(editing ? `/clients/${clientId}` : "/clients");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
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
        <ClientForm formId="client-page-form" client={client} onSubmit={save} />
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="client-page-form" disabled={submitting}>
            {editing ? "Save changes" : "Create client"}
          </Button>
        </div>
      </Card>
    </>
  );
}
