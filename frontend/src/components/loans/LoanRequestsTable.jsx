import { useNavigate } from "react-router-dom";
import { Button, DataTable } from "../ui";
import { initials, StatusBadge } from "../../pages/pageShared";
import { money, date } from "../../utils/finance";
export default function LoanRequestsTable({ applications = [], clients = [] }) {
  const navigate = useNavigate();
  const getClient = (clientId) =>
    clients.find((client) => client.id === clientId);
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
      {applications.map((application) => {
        const client = getClient(application.clientId);
        return (
          <tr key={application.id}>
            <td>
              <div className="review-client-cell">
                <span className="avatar">
                  {client ? initials(client.name) : "?"}
                </span>
                <div>
                  <b>{client ? client.name : "Unknown client"}</b>
                  <br />
                  <span className="mono">{application.clientId}</span>
                </div>
              </div>
            </td>
            <td>{application.type}</td>
            <td className="mono">{money(application.amount)}</td>
            <td>{application.duration} months</td>
            <td>{date(application.submittedDate)}</td>
            <td>
              <StatusBadge value={application.status} />
            </td>
            <td>
              <Button
                variant="secondary"
                onClick={() => navigate(`/loan-applications/${application.id}`)}
              >
                {application.status === "Pending" ? "Review" : "View"}
              </Button>
            </td>
          </tr>
        );
      })}
    </DataTable>
  );
}
export { LoanRequestsTable };
