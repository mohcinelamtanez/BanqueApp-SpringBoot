import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import LoanTable from "../components/loans/LoanTable";
import {
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  LoadingState,
} from "../components/ui";
import { useLoans } from "../hooks/useLoans";
import { money } from "../utils/finance";
import { getClient, loanStats } from "./pageShared";
export default function ClientDetailsPage() {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const client = getClient(clientId);
  const { loading, data: loans = [] } = useLoans();
  if (loading) return <LoadingState />;
  if (!client) return <EmptyState title="Client not found" />;
  const stats = loanStats(clientId, loans);
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Clients", to: "/clients" }, { label: client.name }]}
      />
      <div className="profile card">
        <div>
          <h1>{client.name}</h1>
          <p className="mono">
            {client.id} · {client.city}, Morocco · {money(client.income)}/yr
          </p>
        </div>
        <div className="actions">
          <Button
            variant="secondary"
            onClick={() => navigate(`/clients/${clientId}/edit`)}
          >
            Edit profile
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
          <Button onClick={() => navigate("/loans/new")}>
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
    </>
  );
}
