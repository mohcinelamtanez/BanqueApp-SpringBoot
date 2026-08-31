import { Download, Plus, Search } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Card,
  ConfirmationDialog,
  EmptyState,
  Pagination,
  SuccessModal,
} from "../components/ui";
import ClientTable from "../components/clients/ClientTable";
import ClientFormModal from "../components/clients/ClientFormModal";
import { clients } from "../data/mock/data";
import { clientService } from "../services/clientService";
import { usePagination } from "../hooks/usePagination";
import { csvEscape, downloadCsv, PageHeading } from "./pageShared";

export default function ClientsPage() {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [success, setSuccess] = useState(null);
  const shown = clients.filter((client) =>
    `${client.name} ${client.id} ${client.city}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const {
    page: currentPage,
    setPage,
    totalPages,
    pageItems,
    rangeStart,
    rangeEnd,
  } = usePagination(shown, 5);
  const changeQuery = (value) => {
    setQuery(value);
    setPage(1);
  };
  const exportCsv = () =>
    downloadCsv("clients.csv", [
      "clientId,name,location,totalAssets,status",
      ...shown.map((client) =>
        [
          csvEscape(client.id),
          csvEscape(client.name),
          csvEscape(`${client.city}, ${client.postalCode}`),
          csvEscape(client.totalAssets),
          csvEscape(client.status),
        ].join(","),
      ),
    ]);
  const closeDeleteConfirm = () => {
    if (deleting) return;
    setConfirmDelete(null);
    setDeleteError("");
  };
  const confirmDeleteClient = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await clientService.remove(confirmDelete.id);
      setConfirmDelete(null);
      setSuccess({
        title: "Client Deleted Successfully",
        message: "The client has been successfully removed from the system.",
      });
    } catch {
      setDeleteError("Something went wrong. Please try again.");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <>
      <PageHeading
        title="Clients"
        subtitle="Manage the complete bank customer base."
        action={
          <Button onClick={() => setModal({ mode: "create" })}>
            <Plus size={17} /> Add client
          </Button>
        }
      />
      <Card className="table-card">
        <div className="ct-toolbar">
          <div className="search compact">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => changeQuery(event.target.value)}
              placeholder="Search clients…"
            />
          </div>
          <div className="ct-toolbar-right">
            <button className="export-btn" onClick={exportCsv} type="button">
              <Download size={16} />
              Export
            </button>
            <span className="results-count">
              {shown.length
                ? `Showing ${rangeStart}-${rangeEnd} of ${shown.length} clients`
                : "No clients found"}
            </span>
          </div>
        </div>
        {shown.length ? (
          <>
            <ClientTable
              clients={pageItems}
              onEdit={(client) => setModal({ mode: "edit", client })}
              onDelete={(client) => setConfirmDelete(client)}
            />
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={setPage}
              className="ct-pagination"
            />
          </>
        ) : (
          <EmptyState
            title="No clients found"
            detail="Try adjusting your search."
          />
        )}
      </Card>
      {modal && (
        <ClientFormModal
          mode={modal.mode}
          client={modal.client}
          onClose={() => setModal(null)}
          onSaved={() => {
            const wasEditing = modal.mode === "edit";
            setModal(null);
            setSuccess({
              title: wasEditing
                ? "Client Updated Successfully"
                : "Client Added Successfully",
              message: wasEditing
                ? "The client's information has been successfully updated."
                : "The client has been successfully added to the system.",
            });
          }}
        />
      )}
      {confirmDelete && (
        <ConfirmationDialog
          title="Delete Client?"
          message={`Are you sure you want to delete ${confirmDelete.name}? This action cannot be undone.`}
          confirmLabel="Delete Client"
          submitting={deleting}
          error={deleteError}
          onClose={closeDeleteConfirm}
          onConfirm={confirmDeleteClient}
        />
      )}
      {success && (
        <SuccessModal
          title={success.title}
          message={success.message}
          onClose={() => setSuccess(null)}
        />
      )}
    </>
  );
}
