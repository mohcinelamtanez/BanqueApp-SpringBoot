import { useEffect, useRef, useState } from "react";
import { Eye, Pencil, MoreVertical, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../ui";
import { money } from "../../utils/finance";

function ActionsMenu({ client, onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);
  return (
    <div className="actions-cell" ref={ref}>
      <button
        type="button"
        className={open ? "actions-btn open" : "actions-btn"}
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Actions for ${client.id}`}
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="actions-menu" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onView(client);
            }}
          >
            <Eye size={18} />
            View Details
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit(client);
            }}
          >
            <Pencil size={18} />
            Edit Client
          </button>
          <div className="actions-menu-divider" />
          <button
            type="button"
            role="menuitem"
            className="actions-menu-danger"
            onClick={() => {
              setOpen(false);
              onDelete(client);
            }}
          >
            <Trash2 size={18} />
            Delete Client
          </button>
        </div>
      )}
    </div>
  );
}

export default function ClientTable({ clients = [], onEdit, onDelete }) {
  const navigate = useNavigate();
  const onView = (client) => navigate(`/clients/${client.id}`);
  return (
    <div className="client-table">
      <DataTable
        columns={[
          "Client ID",
          "Name",
          "Location",
          "Annual Income",
          "Status",
          "Actions",
        ]}
      >
        {clients.map((client) => (
          <tr key={client.id}>
            <td className="mono">{client.id}</td>
            <td className="cell-strong">{client.name}</td>
            <td>
              {client.city}
              {client.postalCode ? `, ${client.postalCode}` : ""}
            </td>
            <td className="mono">{money(client.income)}</td>
            <td>
              <span
                className={`status-chip ${client.status === "Actif" ? "actif" : "inactif"}`}
              >
                {client.status}
              </span>
            </td>
            <td>
              <ActionsMenu
                client={client}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
export { ClientTable };
