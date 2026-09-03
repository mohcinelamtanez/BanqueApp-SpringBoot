import { IdCard, Mail, MapPin, Plus, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoanTable from "../components/loans/LoanTable";
import ClientFormModal from "../components/clients/ClientFormModal";
import {
  Breadcrumbs,
  Button,
  Card,
  ConfirmationDialog,
  EmptyState,
  LoadingState,
  SuccessModal,
} from "../components/ui";
import { useLoans } from "../hooks/useLoans";
import { useClient } from "../hooks/useClients";
import { clientService } from "../services/clientService";
import { money } from "../utils/finance";
import { loanStats } from "./pageShared";
export default function ClientDetailsPage() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const { loading: clientLoading, data: client } = useClient(
    clientId,
    refreshKey,
  );
  const { loading: loansLoading, data: loans = [] } = useLoans();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleted, setDeleted] = useState(false);
  if (clientLoading || loansLoading) return <LoadingState />;
  if (deleted) {
    return (
      <SuccessModal
        title="Client Deleted Successfully"
        message="The client has been successfully removed from the system."
        onClose={() => navigate("/clients")}
      />
    );
  }
  if (!client) return <EmptyState title="Client not found" />;
  const stats = loanStats(clientId, loans);
  const closeDeleteConfirm = () => {
    if (deleting) return;
    setConfirmDelete(false);
    setDeleteError("");
  };
  const confirmDeleteClient = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await clientService.remove(clientId);
      setConfirmDelete(false);
      setDeleted(true);
    } catch (error) {
      setDeleteError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Clients", to: "/clients" }, { label: client.name }]}
      />
      <div className="profile card">
        <div>
          <h1>{client.name}</h1>
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
              <span className="profile-meta-item">
                <Wallet size={14} />
                {money(client.income)}/yr
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
        <div className="actions">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            Edit profile
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete profile
          </Button>
        </div>
      </div>
      <div className="summary-grid">
        <Card className="dark-summary">
          <small>TOTAL OUTSTANDING BALANCE</small>
          <strong>{money(stats.outstanding)}</strong>
          <hr />
          <div>
            <span>
              Total borrowed <b>{money(stats.borrowed)}</b>
            </span>
            <span>
              Total repaid <b>{money(stats.repaid)}</b>
            </span>
          </div>
        </Card>
      </div>
      <Card>
        <div className="section-head">
          <h2>Loan History</h2>
          <Button onClick={() => navigate("/loans/add")}>
            <Plus size={16} /> Add loan
          </Button>
        </div>
        {loans.filter((loan) => loan.clientId === clientId).length ? (
          <LoanTable
            loans={loans.filter((loan) => loan.clientId === clientId)}
          />
        ) : (
          <EmptyState title="This client has no loans yet" />
        )}
      </Card>
      {editOpen && (
        <ClientFormModal
          mode="edit"
          client={client}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false);
            setRefreshKey((value) => value + 1);
          }}
        />
      )}
      {confirmDelete && (
        <ConfirmationDialog
          title="Delete Client Profile?"
          message="Deleting this client profile will permanently remove the client and all associated data, including their loans and payment history. This action cannot be undone."
          confirmLabel="Delete Profile"
          submitting={deleting}
          error={deleteError}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDeleteClient}
        />
      )}
    </>
  );
}
