import { useNavigate } from "react-router-dom";
import { Button, DataTable } from "../ui";
import { getClient, initials, StatusBadge } from "../../pages/pageShared";
import { money, date } from "../../utils/finance";
export default function LoanRequestsTable({ loans = [] }) {
  const navigate = useNavigate();
  return (
    <DataTable
      columns={[
        "Client",
        "Loan Type",
        "Requested Amount",
        "Requested Duration",
        "Submitted",
        "Status",
        "Action",
      ]}
    >
      {loans.map((loan) => {
        const client = getClient(loan.clientId);
        return (
          <tr key={loan.id}>
            <td>
              <div className="review-client-cell">
                <span className="avatar">
                  {client ? initials(client.name) : "?"}
                </span>
                <div>
                  <b>{client ? client.name : "Unknown client"}</b>
                  <br />
                  <span className="mono">{loan.clientId}</span>
                </div>
              </div>
            </td>
            <td>{loan.type}</td>
            <td className="mono">{money(loan.amount)}</td>
            <td>{loan.duration} months</td>
            <td>{date(loan.startDate)}</td>
            <td>
              <StatusBadge value={loan.status} />
            </td>
            <td>
              <Button
                variant="secondary"
                onClick={() => navigate(`/loans/requests/${loan.id}`)}
              >
                Review
              </Button>
            </td>
          </tr>
        );
      })}
    </DataTable>
  );
}
export { LoanRequestsTable };
