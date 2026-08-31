import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  History,
  MapPin,
  Search,
  Wallet,
} from "lucide-react";
import { Button, Card, EmptyState } from "../ui";
import { clients } from "../../data/mock/data";
import { money } from "../../utils/finance";
import { initials, loanStats } from "../../pages/pageShared";

export default function ClientSelectionStep({
  loans,
  selectedClient,
  onSelectClient,
  onNext,
}) {
  const [query, setQuery] = useState(selectedClient?.name || "");
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const matches = clients.filter((client) =>
    `${client.name} ${client.id}`.toLowerCase().includes(query.toLowerCase()),
  );
  const stats = selectedClient ? loanStats(selectedClient.id, loans) : null;

  const selectClient = (client) => {
    onSelectClient(client);
    setQuery(client.name);
    setOpen(false);
  };

  return (
    <Card className="assessment-card">
      <h2>Client Identification</h2>
      <div className="assessment-search" ref={boxRef}>
        <label htmlFor="client-search">Search Client Database</label>
        <div className="assessment-search-input">
          <Search size={18} />
          <input
            id="client-search"
            type="text"
            placeholder="Search by Client ID"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              onSelectClient(null);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
          {selectedClient && (
            <CheckCircle2 size={18} className="assessment-search-check" />
          )}
        </div>
        {open && (
          <div className="assessment-dropdown">
            {matches.length ? (
              matches.map((client) => (
                <button
                  type="button"
                  key={client.id}
                  className="assessment-dropdown-item"
                  onClick={() => selectClient(client)}
                >
                  <div>
                    <strong>{client.name}</strong>
                    <span>
                      ID: {client.id} · {client.city}
                    </span>
                  </div>
                  {client.id === selectedClient?.id && <Check size={16} />}
                </button>
              ))
            ) : (
              <div className="assessment-dropdown-empty">
                No clients found.
              </div>
            )}
          </div>
        )}
      </div>
      {selectedClient ? (
        <div className="assessment-grid">
          <div className="assessment-identity">
            <span className="avatar assessment-avatar">
              {initials(selectedClient.name)}
            </span>
            <h4>{selectedClient.name}</h4>
            <p className="mono">ID: {selectedClient.id}</p>
            <p>
              <MapPin size={14} /> {selectedClient.city} ·{" "}
              {selectedClient.postalCode}
            </p>
          </div>
          <div className="assessment-financials">
            <div className="assessment-mini-card">
              <span className="assessment-mini-label">
                <Wallet size={14} /> Annual Income
              </span>
              <strong>{money(selectedClient.income)}</strong>
            </div>
            <div className="assessment-mini-card">
              <span className="assessment-mini-label">
                <History size={14} /> History Overview
              </span>
              <div className="assessment-history-row">
                <span>Active Loans</span>
                <b className="mono">{stats.active}</b>
              </div>
              <div className="assessment-history-row">
                <span>Completed Loans</span>
                <b className="mono">{stats.completed}</b>
              </div>
              <div className="assessment-history-row">
                <span>Rejected Loans</span>
                <b className="mono">{stats.rejected}</b>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No client selected"
          detail="Search and select a client to continue."
        />
      )}
      <div className="assessment-footer">
        <Button disabled={!selectedClient} onClick={onNext}>
          Next: Loan Details <ArrowRight size={16} />
        </Button>
      </div>
    </Card>
  );
}
export { ClientSelectionStep };
