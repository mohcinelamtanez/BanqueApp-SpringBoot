import { useNavigate, useParams } from "react-router-dom";
import { Breadcrumbs, Button, Card, EmptyState } from "../components/ui";
import ClientForm from "../components/clients/ClientForm";
import { clientService } from "../services/clientService";
import { getClient, PageHeading } from "./pageShared";
export default function EditClientPage() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const editing = Boolean(clientId);
  const client = editing ? getClient(clientId) : null;
  if (editing && !client) return <EmptyState title="Client not found" />;
  const save = async (values) => {
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
        <ClientForm
          formId="client-page-form"
          client={client}
          editing={editing}
          onSubmit={save}
        />
        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" form="client-page-form">
            {editing ? "Save changes" : "Create client"}
          </Button>
        </div>
      </Card>
    </>
  );
}
