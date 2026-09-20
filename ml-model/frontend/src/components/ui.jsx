import { useEffect } from "react";
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Check,
  LoaderCircle,
  Building2,
  Landmark,
} from "lucide-react";
export function Logo({ small = false, inverse = false }) {
  return (
    <div className={`brand ${inverse ? "inverse" : ""}`}>
      <span className="brand-row">
        <span className="brand-mark">
          <Landmark size={16} strokeWidth={2} />
        </span>
        {!small && <b>BanqueApp</b>}
      </span>
    </div>
  );
}
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button className={`btn ${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
export function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}
export function Badge({ children, type = "" }) {
  return (
    <span
      className={`badge ${type || String(children).toLowerCase().replaceAll(" ", "-")}`}
    >
      {children}
    </span>
  );
}
export function Input({ label, error, ...props }) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <input {...props} />
      {error && <small className="error">{error}</small>}
    </label>
  );
}
export function Select({ label, children, ...props }) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <select {...props}>{children}</select>
    </label>
  );
}
export function Modal({ title, children, onClose, className = "" }) {
  useEffect(() => {
    if (!onClose) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (onClose && event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={`modal ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header>
          <h2>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
export function ConfirmationDialog({
  title = "Confirm deletion",
  message,
  confirmLabel = "Delete",
  confirmVariant = "danger",
  confirmDisabled = false,
  submitting = false,
  error = "",
  onClose,
  onConfirm,
  children,
}) {
  return (
    <Modal title={title} onClose={submitting ? undefined : onClose}>
      <div className="confirmation">
        <span className="warning">
          <AlertTriangle />
        </span>
        <p>{message}</p>
        {children}
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={submitting || confirmDisabled}
          >
            {submitting && <LoaderCircle size={16} className="spin" />}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export function SuccessModal({ title, message, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="confirmation">
        <span className="success-icon">
          <CheckCircle2 />
        </span>
        <p>{message}</p>
        <div className="actions">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </Modal>
  );
}
export function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label}>
          {item.to ? <a href={item.to}>{item.label}</a> : <b>{item.label}</b>}
          {i < items.length - 1 && <ChevronRight size={15} />}
        </span>
      ))}
    </nav>
  );
}
export function Stepper({ step }) {
  return (
    <div className="stepper">
      {["Select Client", "Loan Details", "Risk Assessment", "Decision"].map(
        (name, index) => (
          <div className={index + 1 <= step ? "done" : ""} key={name}>
            <i>{index + 1 < step ? <Check size={14} /> : index + 1}</i>
            <span>{name}</span>
          </div>
        ),
      )}
    </div>
  );
}
export function DataTable({ columns, children }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function paginationPageList(total, current) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
  if (current > 3) pages.push("…");
  for (
    let page = Math.max(2, current - 1);
    page <= Math.min(total - 1, current + 1);
    page++
  ) {
    pages.push(page);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
export function Pagination({
  page,
  totalPages,
  onChange,
  className = "pagination-bar",
}) {
  return (
    <div className={className}>
      <button
        type="button"
        className="page-btn"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </button>
      <div className="page-numbers">
        {paginationPageList(totalPages, page).map((entry, index) =>
          typeof entry === "number" ? (
            <button
              key={entry}
              type="button"
              className={entry === page ? "page-num active" : "page-num"}
              onClick={() => onChange(entry)}
            >
              {entry}
            </button>
          ) : (
            <span key={`ellipsis-${index}`} className="page-ellipsis">
              {entry}
            </span>
          ),
        )}
      </div>
      <button
        type="button"
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
export function LoadingState({ label = "Loading data…" }) {
  return (
    <div className="state">
      <LoaderCircle className="spin" />
      <p>{label}</p>
    </div>
  );
}
export function EmptyState({ title = "Nothing to display", detail }) {
  return (
    <div className="state">
      <Building2 />
      <h3>{title}</h3>
      <p>{detail}</p>
    </div>
  );
}
export function ErrorState({ detail = "Please try again." }) {
  return (
    <div className="state error-state">
      <AlertTriangle />
      <h3>Unable to load data</h3>
      <p>{detail}</p>
    </div>
  );
}
