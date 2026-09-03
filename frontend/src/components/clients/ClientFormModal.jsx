import { useEffect, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import ClientForm from "./ClientForm";
import { clientService } from "../../services/clientService";

const FORM_ID = "client-modal-form";

export default function ClientFormModal({ mode, client, onClose, onSaved }) {
  const editing = mode === "edit";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const submit = async (values) => {
    setError("");
    setSubmitting(true);
    try {
      const saved = editing
        ? await clientService.update(client.id, values)
        : await clientService.create(values);
      onSaved(saved);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <div
      className="client-modal-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="client-modal"
        role="dialog"
        aria-modal="true"
        aria-label={editing ? "Edit Client" : "Add Client"}
      >
        <header className="client-modal-header">
          <div>
            <h2>{editing ? "Edit Client" : "Add New Client"}</h2>
            <p>
              {editing
                ? `Client ID: ${client.id}`
                : "Enter the primary details for the new client account."}
            </p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </header>
        <div className="client-modal-body">
          <ClientForm formId={FORM_ID} client={client} onSubmit={submit} />
          {error && <p className="error">{error}</p>}
        </div>
        <footer className="client-modal-footer">
          <button
            type="button"
            className="btn secondary"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            form={FORM_ID}
            className="btn primary"
            disabled={submitting}
          >
            {submitting && <LoaderCircle size={16} className="spin" />}
            {editing ? "Save Changes" : "Add Client"}
          </button>
        </footer>
      </section>
    </div>
  );
}
export { ClientFormModal };
