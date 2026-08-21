import { Download } from "lucide-react";
import LoanTable from "../components/loans/LoanTable";
import { Button, Card, LoadingState } from "../components/ui";
import { useLoans } from "../hooks/useLoans";
import { downloadCsv, PageHeading } from "./pageShared";
export default function ReportsPage() {
  const { loading, data = [] } = useLoans();
  if (loading) return <LoadingState />;
  return (
    <>
      <PageHeading
        title="Reports & Analytics"
        subtitle="Loan and repayment reporting."
        action={
          <Button
            onClick={() =>
              downloadCsv("banqueapp-loans-report.csv", [
                "Loan ID,Type,Amount,Risk,Status",
                ...data.map((loan) =>
                  [
                    loan.id,
                    loan.type,
                    loan.amount,
                    loan.risk,
                    loan.status,
                  ].join(","),
                ),
              ])
            }
          >
            <Download size={16} /> Export CSV
          </Button>
        }
      />
      <Card>
        <div className="section-head">
          <h2>Loan report</h2>
          <span>Current loan portfolio</span>
        </div>
        <LoanTable loans={data} />
      </Card>
    </>
  );
}
