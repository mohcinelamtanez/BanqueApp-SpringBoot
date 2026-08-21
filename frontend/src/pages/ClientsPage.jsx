import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  ConfirmationDialog,
  DataTable,
  EmptyState,
  LoadingState,
} from "../components/ui";
import { clients } from "../data/mock/data";
import { clientService } from "../services/clientService";
import { useLoans } from "../hooks/useLoans";
import { money } from "../utils/finance";
import { loanStats, PageHeading } from "./pageShared";
export default function ClientsPage() {
  const navigate = useNavigate();
  const { loading, data: loans = [] } = useLoans();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState(null);
  if (loading) return <LoadingState />;
  const shown = clients.filter((client) =>
    `${client.name} ${client.id} ${client.city}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const remove = async () => {
    await clientService.remove(target.id);
    setTarget(null);
    navigate("/clients");
  };
  return (
    <>
      <PageHeading
        title="Clients"
        subtitle="Manage the complete bank customer base."
        action={
          <Button onClick={() => navigate("/clients/new")}>
            <Plus size={17} /> Add client
          </Button>
        }
      />
      <Card>
        <div className="toolbar">
          <div className="search compact">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search clients…"
            />
          </div>
          <span>{shown.length} clients</span>
        </div>
        {shown.length ? (
          <DataTable
            columns={[
              "Client name",
              "Client ID",
              "Location",
              "Annual income",
              "Active loans",
              "Actions",
            ]}
          >
            {shown.map((client) => (
              <tr key={client.id}>
                <td>
                  <b>{client.name}</b>
                </td>
                <td className="mono">{client.id}</td>
                <td>{client.city}</td>
                <td className="mono">{money(client.income)}</td>
                <td>{loanStats(client.id, loans).active}</td>
                <td>
                  <div className="row-actions">
                    <button onClick={() => navigate(`/clients/${client.id}`)}>
                      <Eye size={17} />
                    </button>
                    <button
                      onClick={() => navigate(`/clients/${client.id}/edit`)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => setTarget(client)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <EmptyState
            title="No clients found"
            detail="Try adjusting your search."
          />
        )}
      </Card>
      {target && (
        <ConfirmationDialog
          message={`Delete ${target.name}? This destructive local action cannot be undone.`}
          onClose={() => setTarget(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}
