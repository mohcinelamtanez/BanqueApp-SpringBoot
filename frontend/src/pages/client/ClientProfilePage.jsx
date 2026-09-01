import { useState } from "react";
import { IdCard, Mail, MapPin } from "lucide-react";
import { Badge, Button, Card, SuccessModal } from "../../components/ui";
import ClientFormModal from "../../components/clients/ClientFormModal";
import { money } from "../../utils/finance";
import { getClient, initials, PageHeading } from "../pageShared";
import { CURRENT_CLIENT_ID } from "./clientShared";

export default function ClientProfilePage() {
  const [client, setClient] = useState(() => getClient(CURRENT_CLIENT_ID));
  const [editOpen, setEditOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [firstName, ...rest] = client.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <>
      <PageHeading
        title="My Profile"
        subtitle="View and manage your personal information."
      />
      <div className="profile card">
        <div className="profile-heading">
          <span className="avatar profile-avatar">{initials(client.name)}</span>
          <div>
            <h1>{client.name}</h1>
            <p className="profile-role">
              <Badge>Client</Badge>
            </p>
            <div className="profile-meta">
              <div className="profile-meta-row mono">
                <span className="profile-meta-item">
                  <IdCard size={14} />
                  {client.id}
                </span>
                <span className="profile-meta-item">
                  <MapPin size={14} />
                  {client.city}, Morocco
                </span>
              </div>
              <div className="profile-meta-row profile-meta-email mono">
                <span className="profile-meta-item">
                  <Mail size={14} />
                  {client.email}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="actions">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="detail-grid">
        <Card>
          <h2>Personal Information</h2>
          <dl>
            <dt>First Name</dt>
            <dd>{firstName}</dd>
            <dt>Last Name</dt>
            <dd>{lastName || "—"}</dd>
            <dt>Email</dt>
            <dd>{client.email}</dd>
          </dl>
        </Card>
        <Card>
          <h2>Address</h2>
          <dl>
            <dt>City</dt>
            <dd>{client.city}</dd>
            <dt>Postal Code</dt>
            <dd>{client.postalCode}</dd>
          </dl>
        </Card>
      </div>

      <Card>
        <h2>Financial Information</h2>
        <dl>
          <dt>Annual Revenue</dt>
          <dd>{money(client.income)} / year</dd>
          <dt>Total Assets</dt>
          <dd>{money(client.totalAssets)}</dd>
        </dl>
      </Card>

      {editOpen && (
        <ClientFormModal
          mode="edit"
          client={client}
          onClose={() => setEditOpen(false)}
          onSaved={(saved) => {
            setClient({ ...saved });
            setEditOpen(false);
            setShowSuccess(true);
          }}
        />
      )}
      {showSuccess && (
        <SuccessModal
          title="Profile Updated Successfully"
          message="Your profile information has been updated."
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
