import { Landmark } from "lucide-react";
import { Badge, Card } from "../components/ui";
import { clients } from "../data/mock/data";

export const getClient = (id) => clients.find((client) => client.id === id);
export function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
export function loanStats(clientId, loans) {
  const list = loans.filter((loan) => loan.clientId === clientId);
  return {
    total: list.filter((loan) => loan.status !== "Rejected").length,
    active: list.filter((loan) => loan.status === "Active").length,
    completed: list.filter((loan) => loan.status === "Completed").length,
    rejected: list.filter((loan) => loan.status === "Rejected").length,
    outstanding: list
      .filter((loan) => loan.status === "Active")
      .reduce((sum, loan) => sum + loan.amount - loan.repaid, 0),
    borrowed: list
      .filter((loan) => loan.status !== "Rejected")
      .reduce((sum, loan) => sum + loan.amount, 0),
    repaid: list.reduce((sum, loan) => sum + loan.repaid, 0),
  };
}
export function StatusBadge({ value, risk = false }) {
  return (
    <Badge type={risk ? `risk-${String(value).toLowerCase()}` : ""}>
      {risk ? `${value} Risk` : value}
    </Badge>
  );
}
export function PageHeading({ title, subtitle, action }) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function Metric({ label, value, icon = <Landmark />, footer }) {
  return (
    <Card className="metric">
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <p>
          {footer ?? (
            <>
              <span>↑</span> Updated from current portfolio
            </>
          )}
        </p>
      </div>
      {icon}
    </Card>
  );
}
export function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
export function downloadCsv(name, rows) {
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(
    new Blob([rows.join("\n")], { type: "text/csv" }),
  );
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}
