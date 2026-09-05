import { useState } from "react";
import { IdCard, Mail, MapPin } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  LoadingState,
  SuccessModal,
} from "../../components/ui";
import ClientFormModal from "../../components/clients/ClientFormModal";
import { useClient } from "../../hooks/useClients";
import { money } from "../../utils/finance";
import { initials, PageHeading } from "../pageShared";
import { getCurrentClientId } from "./clientShared";

export default function ClientProfilePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { loading, data: client } = useClient(getCurrentClientId(), refreshKey);
  const [editOpen, setEditOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (loading) return <LoadingState />;
  if (!client) return <EmptyState title="Profile not found" />;

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
            <dd>{client.firstName}</dd>
            <dt>Last Name</dt>
            <dd>{client.lastName || "—"}</dd>
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
            <dd>{client.postalCode || "—"}</dd>
          </dl>
        </Card>
      </div>

      <Card>
        <h2>Financial Information</h2>
        <dl>
          <dt>Annual Revenue</dt>
          <dd>{money(client.income)} / year</dd>
        </dl>
      </Card>

      {editOpen && (
        <ClientFormModal
          mode="edit"
          client={client}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false);
            setShowSuccess(true);
            setRefreshKey((value) => value + 1);
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
