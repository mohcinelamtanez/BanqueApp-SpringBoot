import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Users,
} from "lucide-react";
import { Button, Card, LoadingState } from "../components/ui";
import { useClients } from "../hooks/useClients";
import { useLoans } from "../hooks/useLoans";
import { money } from "../utils/finance";
import { Metric, PageHeading } from "./pageShared";
export default function DashboardPage() {
  const { loading: loansLoading, data: loans = [] } = useLoans();
  const { loading: clientsLoading, data: clients = [] } = useClients();
  if (loansLoading || clientsLoading) return <LoadingState />;
  const active = loans.filter((loan) => loan.status === "Active");
  // A Pending application hasn't been decided yet — no money has actually
  // been granted until it becomes an Active (or Completed) Loan.
  const granted = loans
    .filter((loan) => loan.status === "Active" || loan.status === "Completed")
    .reduce((sum, loan) => sum + loan.amount, 0);
  const outstanding = active.reduce(
    (sum, loan) => sum + loan.amount - loan.repaid,
    0,
  );
  return (
    <>
      <PageHeading
        title="Dashboard Overview"
        subtitle="Real-time metrics and loan performance."
        action={
          <Button variant="secondary">
            <Download size={16} /> Export Report
          </Button>
        }
      />
      <div className="dashboard-grid">
        <div className="kpis">
          <Metric
            label="Total Clients"
            value={clients.length}
            icon={<Users />}
          />
          <Metric
            label="Approved / Active Loans"
            value={active.length}
            icon={<CheckCircle2 />}
          />
          <Metric
            label="Repaid / Completed Loans"
            value={loans.filter((loan) => loan.status === "Completed").length}
            icon={<ClipboardCheck />}
          />
        </div>
        <Card className="grant">
          <small>TOTAL AMOUNT GRANTED</small>
          <strong>{money(granted)}</strong>
        </Card>
        <Card className="outstanding">
          <small>REMAINING OUTSTANDING</small>
          <strong>{money(outstanding)}</strong>
          <div className="progress">
            <i
              style={{
                width: `${granted ? (outstanding / granted) * 100 : 0}%`,
              }}
            />
          </div>
        </Card>
      </div>
      <Card className="chart-placeholder">
        <BarChart3 size={30} />
        <div>
          <b>Portfolio activity</b>
          <p>
            Charts and recent activity will use live data when backend
            integration is connected.
          </p>
        </div>
      </Card>
    </>
  );
}
