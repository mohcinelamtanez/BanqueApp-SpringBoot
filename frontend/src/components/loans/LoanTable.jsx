import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../ui";
import { money, loanSummary } from "../../utils/finance";
import { StatusBadge } from "../../pages/pageShared";
export default function LoanTable({ loans, onDelete }) {
  const navigate = useNavigate();
  return;
  <DataTable
    columns={[
      "Loan ID & type",
      "Amount",
      "Terms",
      "Risk / status",
      "Dates",
      "Actions",
    ]}
  >
    {loans.map((loan) => (
      <tr key={loan.id}>
        <td>
          <b className="mono">{loan.id}</b>
          <br />
          <span>{loan.type}</span>
        </td>
        <td className="mono">{money(loan.amount)}</td>
        <td>
          {loan.duration} mo @ {loan.rate}%<br />
          {money(
            loanSummary(loan.amount, loan.duration, loan.rate).monthlyPayment,
          )}{" "}
          / mo
        </td>
        <td>
          <StatusBadge value={loan.risk} risk />
          <br />
          <StatusBadge value={loan.status} />
        </td>
        <td>
          {loan.startDate}
          <br />
          {loan.endDate || "—"}
        </td>
        <td>
          <div className="row-actions">
            <button onClick={() => navigate(`/loans/${loan.id}`)}>
              <Eye size={16} />
            </button>
            <button onClick={() => navigate(`/loans/${loan.id}/edit`)}>
              <Pencil size={16} />
            </button>
            {onDelete && (
              <button onClick={() => onDelete(loan)}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </td>
      </tr>
    ))}
  </DataTable>;
}
export { LoanTable };
