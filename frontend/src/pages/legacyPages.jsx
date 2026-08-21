import { useEffect, useMemo, useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Landmark,
  BarChart3,
  ShieldCheck,
  Settings,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  ClipboardCheck,
} from "lucide-react";
import { clients, notifications } from "../data/mock/data";
import {
  clientService,
  loanService,
  paymentService,
} from "../services/dataServices";
import { money, date, loanSummary } from "../utils/finance";
import {
  Logo,
  Button,
  Card,
  Badge,
  Input,
  Select,
  Modal,
  ConfirmationDialog,
  Breadcrumbs,
  Stepper,
  DataTable,
  LoadingState,
  EmptyState,
} from "../components/ui";

const navItems = [
  [LayoutDashboard, "Dashboard", "/dashboard"],
  [Users, "Clients", "/clients"],
  [Landmark, "Loans", "/loans"],
  [BarChart3, "Reports", "/reports"],
  [ShieldCheck, "Security", "/security"],
  [Settings, "Settings", "/settings"],
];
function useResource(loader, id) {
  const [state, setState] = useState({ loading: true, data: null });
  useEffect(() => {
    let live = true;
    setState({ loading: true, data: null });
    loader(id).then((data) => live && setState({ loading: false, data }));
    return () => {
      live = false;
    };
  }, [id]);
  return state;
}
function Status({ value, risk = false }) {
  return (
    <Badge type={risk ? `risk-${String(value).toLowerCase()}` : ""}>
      {risk ? `${value} Risk` : value}
    </Badge>
  );
}
function getClient(id) {
  return clients.find((c) => c.id === id);
}
function loanStats(clientId, allLoans) {
  const list = allLoans.filter((l) => l.clientId === clientId);
  return {
    total: list.filter((l) => l.status !== "Rejected").length,
    active: list.filter((l) => l.status === "Active").length,
    completed: list.filter((l) => l.status === "Completed").length,
    rejected: list.filter((l) => l.status === "Rejected").length,
    outstanding: list
      .filter((l) => l.status === "Active")
      .reduce((s, l) => s + l.amount - l.repaid, 0),
    borrowed: list
      .filter((l) => l.status !== "Rejected")
      .reduce((s, l) => s + l.amount, 0),
    repaid: list.reduce((s, l) => s + l.repaid, 0),
  };
}
export function AppLayout({ children }) {
  const [drawer, setDrawer] = useState(false),
    [notice, setNotice] = useState(false);
  return (
    <div className="app-shell">
      <aside className={drawer ? "sidebar open" : "sidebar"}>
        <div className="side-top">
          <Logo inverse />
          <button className="mobile-close" onClick={() => setDrawer(false)}>
            <X />
          </button>
        </div>
        <nav>
          {navItems.map(([Icon, label, to]) => (
            <NavLink key={to} to={to} onClick={() => setDrawer(false)}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="logout">
          ↪ <span>Logout</span>
        </div>
      </aside>
      <div className="page-shell">
        <header className="topbar">
          <button className="menu-button" onClick={() => setDrawer(true)}>
            <Menu />
          </button>
          <div className="search">
            <Search size={17} />
            <input placeholder="Search…" aria-label="Search" />
          </div>
          <div className="top-links">
            <span>Overview</span>
            <span>Analytics</span>
            <span>Management</span>
          </div>
          <button
            className="icon-button notification"
            onClick={() => setNotice(!notice)}
            aria-label="Notifications"
          >
            <Bell size={21} />
            <i />
          </button>
          <div className="avatar">BA</div>
          {notice && <NotificationCenter onClose={() => setNotice(false)} />}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
function NotificationCenter({ onClose }) {
  return (
    <section className="notification-center">
      <header>
        <h3>Notifications</h3>
        <button onClick={onClose}>
          <X size={17} />
        </button>
      </header>
      {notifications.map((n) => (
        <article key={n.id}>
          <span className={n.unread ? "dot" : ""} />
          <div>
            <b>{n.title}</b>
            <p>{n.text}</p>
            <small>{n.time}</small>
          </div>
        </article>
      ))}
    </section>
  );
}
export function Dashboard() {
  const { loading, data: allLoans } = useResource(loanService.list);
  if (loading) return <LoadingState />;
  const active = allLoans.filter((l) => l.status === "Active"),
    completed = allLoans.filter((l) => l.status === "Completed");
  const granted = allLoans
    .filter((l) => l.status !== "Rejected")
    .reduce((s, l) => s + l.amount, 0);
  const outstanding = active.reduce((s, l) => s + l.amount - l.repaid, 0);
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
            value={completed.length}
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
      <Card className="assistant-card">
        <b>Banque AI Assistant</b>
        <span>Coming soon</span>
        <p>
          Ask questions about loan distributions, client growth, or risk
          metrics.
        </p>
      </Card>
    </>
  );
}
function Metric({ label, value, icon }) {
  return (
    <Card className="metric">
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <p>
          <span>↑</span> Updated from current portfolio
        </p>
      </div>
      {icon}
    </Card>
  );
}
function PageHeading({ title, subtitle, action }) {
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
function ClientsPage() {
  const navigate = useNavigate();
  const { loading, data: allLoans } = useResource(loanService.list);
  const [query, setQuery] = useState(""),
    [target, setTarget] = useState(null);
  if (loading) return <LoadingState />;
  const shown = clients.filter((c) =>
    `${c.name} ${c.id} ${c.city}`.toLowerCase().includes(query.toLowerCase()),
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
              onChange={(e) => setQuery(e.target.value)}
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
            {shown.map((c) => {
              let s = loanStats(c.id, allLoans);
              return (
                <tr key={c.id}>
                  <td>
                    <b>{c.name}</b>
                  </td>
                  <td className="mono">{c.id}</td>
                  <td>{c.city}</td>
                  <td className="mono">{money(c.income)}</td>
                  <td>{s.active}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        title="View details"
                        onClick={() => navigate(`/clients/${c.id}`)}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        title="Edit client"
                        onClick={() => navigate(`/clients/${c.id}/edit`)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        title="Delete client"
                        onClick={() => setTarget(c)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
function ClientForm() {
  const nav = useNavigate(),
    { clientId } = useParams(),
    editing = !!clientId;
  const [form, setForm] = useState(
    editing
      ? getClient(clientId)
      : { id: "", name: "", city: "", postalCode: "", income: "", email: "" },
  );
  const [errors, setErrors] = useState({});
  if (editing && !form) return <EmptyState title="Client not found" />;
  const save = async (e) => {
    e.preventDefault();
    let x = {};
    ["id", "name", "city", "postalCode", "income"].forEach((k) => {
      if (!form[k]) x[k] = "Required";
    });
    if (Object.keys(x).length) return setErrors(x);
    const values = {
      ...form,
      income: Number(form.income),
      id: editing ? form.id : form.id.toUpperCase(),
    };
    editing
      ? await clientService.update(clientId, values)
      : await clientService.create(values);
    nav(editing ? `/clients/${clientId}` : "/clients");
  };
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Clients", to: "/clients" },
          { label: editing ? "Edit client" : "Add client" },
        ]}
      />
      <PageHeading
        title={editing ? "Edit Client" : "Add Client"}
        subtitle="Keep client information accurate and up to date."
      />
      <Card className="form-card">
        <form onSubmit={save} className="form-grid">
          <Input
            label="Client name"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Client ID"
            value={form.id}
            disabled={editing}
            error={errors.id}
            placeholder="CLI-0000-A"
            onChange={(e) => setForm({ ...form, id: e.target.value })}
          />
          <Input
            label="City"
            value={form.city}
            error={errors.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <Input
            label="Postal code"
            value={form.postalCode}
            error={errors.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
          <Input
            label="Annual income (MAD)"
            type="number"
            min="1"
            value={form.income}
            error={errors.income}
            onChange={(e) => setForm({ ...form, income: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={() => nav(-1)}>
              Cancel
            </Button>
            <Button>{editing ? "Save changes" : "Create client"}</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
function ClientDetails() {
  const nav = useNavigate(),
    { clientId } = useParams();
  const { loading, data: allLoans } = useResource(loanService.list);
  const client = getClient(clientId);
  const [target, setTarget] = useState(null);
  if (loading) return <LoadingState />;
  if (!client) return <EmptyState title="Client not found" />;
  const list = allLoans.filter((l) => l.clientId === clientId),
    s = loanStats(clientId, allLoans);
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
            onClick={() => nav(`/clients/${clientId}/edit`)}
          >
            Edit profile
          </Button>
          <Button variant="danger" onClick={() => setTarget(client)}>
            Delete
          </Button>
        </div>
      </div>
      <div className="summary-grid">
        <Card className="dark-summary">
          <small>TOTAL OUTSTANDING BALANCE</small>
          <strong>{money(s.outstanding)}</strong>
          <hr />
          <div>
            <span>
              Total borrowed <b>{money(s.borrowed)}</b>
            </span>
            <span>
              Total repaid <b>{money(s.repaid)}</b>
            </span>
          </div>
        </Card>
        <Metric label="Total loans" value={s.total} icon={<Landmark />} />
        <Card className="metric">
          <small>LOAN SUMMARY</small>
          <p>
            <Badge>Active {s.active}</Badge>{" "}
            <Badge>Completed {s.completed}</Badge>
          </p>
        </Card>
      </div>
      <Card>
        <div className="section-head">
          <h2>Loan History</h2>
          <Button onClick={() => nav("/loans/new")}>
            <Plus size={16} /> Add loan
          </Button>
        </div>
        {list.length ? (
          <LoanTable loans={list} />
        ) : (
          <EmptyState
            title="This client has no loans yet"
            detail="They can still be selected for a new loan."
          />
        )}
      </Card>
      {target && (
        <ConfirmationDialog
          message={`Delete ${client.name}? This destructive local action cannot be undone.`}
          onClose={() => setTarget(null)}
          onConfirm={async () => {
            await clientService.remove(client.id);
            nav("/clients");
          }}
        />
      )}
    </>
  );
}
function LoanTable({ loans: list }) {
  const nav = useNavigate();
  const [target, setTarget] = useState(null);
  const remove = async () => {
    await loanService.remove(target.id);
    setTarget(null);
    nav("/loans");
  };
  return (
    <>
      {
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
          {list.map((l) => (
            <tr key={l.id}>
              <td>
                <b className="mono">{l.id}</b>
                <br />
                <span>{l.type}</span>
              </td>
              <td className="mono">{money(l.amount)}</td>
              <td className="mono">
                {l.duration} mo @ {l.rate}%<br />
                {money(
                  loanSummary(l.amount, l.duration, l.rate).monthlyPayment,
                )}{" "}
                / mo
              </td>
              <td>
                <Status value={l.risk} risk />
                <br />
                <Status value={l.status} />
              </td>
              <td>
                {date(l.startDate)}
                <br />
                {date(l.endDate)}
              </td>
              <td>
                <div className="row-actions">
                  <button onClick={() => nav(`/loans/${l.id}`)}>
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => nav(`/loans/${l.id}/payments`)}
                    title="Payments"
                  >
                    <MoreHorizontal size={17} />
                  </button>
                  <button onClick={() => nav(`/loans/${l.id}/edit`)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setTarget(l)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      }
      {target && (
        <ConfirmationDialog
          message={`Delete loan ${target.id}? This destructive local action cannot be undone.`}
          onClose={() => setTarget(null)}
          onConfirm={remove}
        />
      )}
    </>
  );
}
function LoansPage() {
  const nav = useNavigate();
  const { loading, data } = useResource(loanService.list);
  if (loading) return <LoadingState />;
  return (
    <>
      <PageHeading
        title="Loan Management"
        subtitle="Monitor the complete loan portfolio."
        action={
          <Button onClick={() => nav("/loans/new")}>
            <Plus size={17} /> New loan
          </Button>
        }
      />
      <Card>
        <LoanTable loans={data} />
      </Card>
    </>
  );
}
function LoanDetails() {
  const nav = useNavigate(),
    { loanId } = useParams();
  const { loading, data: loan } = useResource(loanService.get, loanId);
  if (loading) return <LoadingState />;
  if (!loan) return <EmptyState title="Loan not found" />;
  const client = getClient(loan.clientId),
    sum = loanSummary(loan.amount, loan.duration, loan.rate);
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Loans", to: "/loans" },
          { label: client.name, to: `/clients/${client.id}` },
          { label: loan.id },
        ]}
      />
      <PageHeading
        title={`Loan ${loan.id}`}
        subtitle={`${loan.type} for ${client.name}`}
        action={
          <div className="actions">
            <Button
              variant="secondary"
              onClick={() => nav(`/loans/${loan.id}/payments`)}
            >
              Payment history
            </Button>
            <Button onClick={() => nav(`/loans/${loan.id}/edit`)}>
              Edit loan
            </Button>
          </div>
        }
      />
      <div className="detail-grid">
        <Card>
          <h2>Loan information</h2>
          <dl>
            <dt>Client</dt>
            <dd>{client.name}</dd>
            <dt>Principal amount</dt>
            <dd className="mono">{money(loan.amount)}</dd>
            <dt>Annual interest rate</dt>
            <dd>{loan.rate}%</dd>
            <dt>Duration</dt>
            <dd>{loan.duration} months</dd>
            <dt>Risk</dt>
            <dd>
              <Status value={loan.risk} risk />
            </dd>
            <dt>Status</dt>
            <dd>
              <Status value={loan.status} />
            </dd>
          </dl>
        </Card>
        <Card>
          <h2>Financial summary</h2>
          <dl>
            <dt>Monthly payment</dt>
            <dd className="mono">{money(sum.monthlyPayment)}</dd>
            <dt>Principal amount</dt>
            <dd className="mono">{money(sum.principal)}</dd>
            <dt>Estimated interest</dt>
            <dd className="mono">{money(sum.estimatedInterest)}</dd>
            <dt>Total repayment</dt>
            <dd className="mono">{money(sum.totalRepayment)}</dd>
          </dl>
        </Card>
      </div>
    </>
  );
}
function LoanForm() {
  const nav = useNavigate(),
    { loanId } = useParams(),
    editing = !!loanId;
  const initial = editing
    ? undefined
    : {
        clientId: clients[0].id,
        type: "Consumer Loan",
        amount: "",
        rate: "",
        duration: "",
        risk: "LOW",
        status: "Pending",
      };
  const { loading, data } = useResource(
    editing ? loanService.get : () => Promise.resolve(initial),
    loanId,
  );
  const [form, setForm] = useState(null);
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);
  if (loading || !form) return <LoadingState />;
  const sum = loanSummary(form.amount, form.duration, form.rate);
  const save = async (e) => {
    e.preventDefault();
    if (
      !form.clientId ||
      Number(form.amount) <= 0 ||
      Number(form.duration) <= 0 ||
      Number(form.rate) < 0
    )
      return;
    const values = {
      ...form,
      amount: Number(form.amount),
      duration: Number(form.duration),
      rate: Number(form.rate),
    };
    if (editing) await loanService.update(loanId, values);
    else
      await loanService.create({
        ...values,
        id: `LN-${Date.now().toString().slice(-4)}`,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: null,
        repaid: 0,
      });
    nav("/loans");
  };
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Loans", to: "/loans" },
          { label: editing ? "Edit loan" : "Add loan" },
        ]}
      />
      <PageHeading
        title={editing ? "Edit Loan" : "Add Loan"}
        subtitle="Enter the loan details."
      />
      <Card className="form-card">
        <form className="form-grid" onSubmit={save}>
          <Select
            label="Client"
            value={form.clientId}
            onChange={(e) => setForm({ ...form, clientId: e.target.value })}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.id}
              </option>
            ))}
          </Select>
          <Select
            label="Loan type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>Auto Loan</option>
            <option>Consumer Loan</option>
          </Select>
          <Input
            label="Requested amount (MAD)"
            type="number"
            min="1"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            label="Duration (months)"
            type="number"
            min="1"
            required
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <Input
            label="Annual interest rate (%)"
            type="number"
            min="0"
            step="0.1"
            required
            value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
          />
          <Select
            label="Risk level"
            value={form.risk}
            onChange={(e) => setForm({ ...form, risk: e.target.value })}
          >
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </Select>
          <div className="finance-preview">
            <b>Financial summary</b>
            <span>Monthly payment: {money(sum.monthlyPayment)}</span>
            <span>Total repayment: {money(sum.totalRepayment)}</span>
          </div>
          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={() => nav(-1)}>
              Cancel
            </Button>
            <Button>{editing ? "Save changes" : "Create loan"}</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
function PaymentsPage() {
  const { loanId } = useParams(),
    nav = useNavigate();
  const { loading, data } = useResource(paymentService.list, loanId);
  const loan = useResource(loanService.get, loanId).data;
  if (loading || !loan) return <LoadingState />;
  const exportCsv = () => {
    const csv = [
      "Payment ID,Amount,Payment date,Due date,Status,Information",
      ...data.map((p) =>
        [p.id, p.amount, p.date || "", p.dueDate, p.status, p.note].join(","),
      ),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `${loanId}-payments.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Loans", to: "/loans" },
          { label: loanId, to: `/loans/${loanId}` },
          { label: "Payments" },
        ]}
      />
      <PageHeading
        title="Payment History"
        subtitle={`Payment activity for ${loanId}.`}
        action={
          <Button variant="secondary" onClick={exportCsv}>
            <Download size={16} /> Export CSV
          </Button>
        }
      />
      <Card>
        {data.length ? (
          <DataTable
            columns={[
              "Payment ID",
              "Amount",
              "Payment date",
              "Due date",
              "Status",
              "Payment information",
            ]}
          >
            {data.map((p) => (
              <tr key={p.id}>
                <td className="mono">{p.id}</td>
                <td className="mono">{money(p.amount)}</td>
                <td>{date(p.date)}</td>
                <td>{date(p.dueDate)}</td>
                <td>
                  <Status value={p.status} />
                </td>
                <td>{p.note}</td>
              </tr>
            ))}
          </DataTable>
        ) : (
          <EmptyState
            title="No payments found"
            detail="Payment information will appear here."
          />
        )}
      </Card>
    </>
  );
}
function AddLoanWorkflow() {
  const nav = useNavigate();
  const [step, setStep] = useState(1),
    [query, setQuery] = useState(""),
    [client, setClient] = useState(null),
    [loan, setLoan] = useState({
      type: "Consumer Loan",
      amount: "",
      duration: "",
      rate: "",
    }),
    [risk, setRisk] = useState(null),
    [loading, setLoading] = useState(false),
    [reason, setReason] = useState(""),
    [decision, setDecision] = useState(null);
  const selected = clients.find((c) => c.id === query.toUpperCase()) || client;
  const sum = loanSummary(loan.amount, loan.duration, loan.rate);
  const calculate = () => {
    if (!loan.amount || !loan.duration || loan.rate === "") return;
    setLoading(true);
    setTimeout(() => {
      const score =
        Number(loan.amount) > 100000
          ? 68
          : Number(loan.duration) > 48
            ? 42
            : 18;
      setRisk({
        score,
        level: score > 60 ? "HIGH" : score > 35 ? "MEDIUM" : "LOW",
      });
      setLoading(false);
    }, 900);
  };
  const create = async (status) => {
    const id = `LN-${Date.now().toString().slice(-4)}`;
    await loanService.create({
      id,
      clientId: selected.id,
      type: loan.type,
      amount: Number(loan.amount),
      duration: Number(loan.duration),
      rate: Number(loan.rate),
      risk: risk.level,
      status,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: null,
      repaid: 0,
      rejectionReason: status === "Rejected" ? reason : undefined,
    });
    setDecision(status);
  };
  if (decision)
    return (
      <>
        <Breadcrumbs
          items={[{ label: "Loans", to: "/loans" }, { label: "New loan" }]}
        />
        <Card className="success-card">
          <CheckCircle2 />
          <h1>Loan {decision.toLowerCase()}</h1>
          <p>
            {decision === "Approved"
              ? "The loan has been added as active."
              : "The loan decision was recorded with its rejection reason."}
          </p>
          <Button onClick={() => nav("/loans")}>Return to loans</Button>
        </Card>
      </>
    );
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Loans", to: "/loans" }, { label: "New loan" }]}
      />
      <PageHeading
        title="New Loan Assessment"
        subtitle="Complete each step before making an administrative decision."
      />
      <Stepper step={step} />
      {step === 1 && (
        <Card className="workflow">
          <h2>Select client</h2>
          <p>Search by client ID to select an existing client.</p>
          <div className="search wide">
            <Search size={17} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Client ID"
            />
          </div>
          {selected ? (
            <ClientChoice
              client={selected}
              onSelect={() => setClient(selected)}
            />
          ) : (
            <EmptyState
              title="Enter a client ID"
              detail="For example: CLI-9824-A"
            />
          )}
          <div className="form-actions">
            <Button
              disabled={!selected}
              onClick={() => {
                setClient(selected);
                setStep(2);
              }}
            >
              Continue <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      )}
      {step === 2 && (
        <Card className="workflow">
          <h2>Loan details</h2>
          <div className="form-grid">
            <Select
              label="Loan type"
              value={loan.type}
              onChange={(e) => setLoan({ ...loan, type: e.target.value })}
            >
              <option>Auto Loan</option>
              <option>Consumer Loan</option>
            </Select>
            <Input
              label="Requested amount (MAD)"
              type="number"
              min="1"
              value={loan.amount}
              onChange={(e) => setLoan({ ...loan, amount: e.target.value })}
            />
            <Input
              label="Duration in months"
              type="number"
              min="1"
              value={loan.duration}
              onChange={(e) => setLoan({ ...loan, duration: e.target.value })}
            />
            <Input
              label="Annual interest rate (%)"
              type="number"
              min="0"
              step=".1"
              value={loan.rate}
              onChange={(e) => setLoan({ ...loan, rate: e.target.value })}
            />
            <FinanceCard sum={sum} />
          </div>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              disabled={!loan.amount || !loan.duration || loan.rate === ""}
              onClick={() => setStep(3)}
            >
              Continue
            </Button>
          </div>
        </Card>
      )}
      {step === 3 && (
        <Card className="workflow">
          <h2>Risk assessment</h2>
          <p>
            The ML assessment is informational and separate from the final
            decision.
          </p>
          {loading ? (
            <LoadingState label="Calculating risk assessment…" />
          ) : risk ? (
            <div className="risk-result">
              <strong>{risk.score}</strong>
              <span>Risk score</span>
              <Status value={risk.level} risk />
            </div>
          ) : (
            <Button onClick={calculate}>Calculate Risk</Button>
          )}
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button disabled={!risk} onClick={() => setStep(4)}>
              Continue to decision
            </Button>
          </div>
        </Card>
      )}
      {step === 4 && (
        <Card className="workflow">
          <h2>Decision</h2>
          <div className="review">
            <p>
              <b>Client:</b> {selected.name} ({selected.id})
            </p>
            <p>
              <b>{loan.type}:</b> {money(loan.amount)} over {loan.duration}{" "}
              months at {loan.rate}%
            </p>
            <p>
              <b>Risk result:</b> <Status value={risk.level} risk /> score{" "}
              {risk.score}
            </p>
            <p>
              <b>Total repayment:</b> {money(sum.totalRepayment)}
            </p>
          </div>
          <label className="field">
            <span>Rejection reason (required only if rejecting)</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the administrative rejection decision…"
            />
          </label>
          <div className="form-actions">
            <Button variant="secondary" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button
              variant="danger"
              disabled={!reason.trim()}
              onClick={() => create("Rejected")}
            >
              Reject
            </Button>
            <Button onClick={() => create("Approved")}>Approve</Button>
          </div>
        </Card>
      )}
    </>
  );
}
function ClientChoice({ client, onSelect }) {
  const all = useResource(loanService.list).data || [];
  const s = loanStats(client.id, all);
  return (
    <div className="client-choice">
      <div>
        <b>{client.name}</b>
        <p className="mono">
          {client.id} · {client.city} · {client.postalCode}
        </p>
        <p>{money(client.income)} annual income</p>
      </div>
      <div>
        <Badge>Active {s.active}</Badge> <Badge>Completed {s.completed}</Badge>{" "}
        <Badge type="rejected">Rejected {s.rejected}</Badge>
      </div>
      <Button variant="secondary" onClick={onSelect}>
        Select
      </Button>
    </div>
  );
}
function FinanceCard({ sum }) {
  return (
    <Card className="finance-card">
      <h3>Financial Summary</h3>
      <span>
        Monthly payment <b>{money(sum.monthlyPayment)}</b>
      </span>
      <span>
        Principal amount <b>{money(sum.principal)}</b>
      </span>
      <span>
        Estimated interest <b>{money(sum.estimatedInterest)}</b>
      </span>
      <span>
        Total repayment <b>{money(sum.totalRepayment)}</b>
      </span>
    </Card>
  );
}
function Reports() {
  const { loading, data } = useResource(loanService.list);
  if (loading) return <LoadingState />;
  const paid = data.filter((l) => l.status === "Completed");
  const exportCsv = () => {
    const csv = [
      "Loan ID,Client,Type,Amount,Risk,Status",
      ...data
        .map((l) =>
          [
            l.id,
            getClient(l.clientId).name,
            l.type,
            l.amount,
            l.risk,
            l.status,
          ].join(","),
        )
        .join("\n"),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "banqueapp-loans-report.csv";
    a.click();
  };
  return (
    <>
      <PageHeading
        title="Reports & Analytics"
        subtitle="Loan and repayment reporting."
        action={
          <Button onClick={exportCsv}>
            <Download size={16} /> Export CSV
          </Button>
        }
      />
      <div className="summary-grid">
        <Metric
          label="Portfolio loans"
          value={data.length}
          icon={<Landmark />}
        />
        <Metric
          label="Paid loans"
          value={paid.length}
          icon={<CheckCircle2 />}
        />
        <Metric
          label="Payment reporting"
          value="Available"
          icon={<BarChart3 />}
        />
      </div>
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
function Security() {
  return (
    <>
      <PageHeading
        title="Security Management"
        subtitle="Visual audit overview for the BanqueApp portal."
        action={
          <Button>
            <Download size={16} /> Export audit log
          </Button>
        }
      />
      <Card>
        <div className="section-head">
          <h2>Security audit</h2>
          <Badge>Review needed</Badge>
        </div>
        <DataTable columns={["Event", "Date", "Information", "Status"]}>
          <tr>
            <td>Administrative configuration updated</td>
            <td>{date("2026-08-20")}</td>
            <td>Application preferences were reviewed.</td>
            <td>
              <Badge>Recorded</Badge>
            </td>
          </tr>
          <tr>
            <td>Security audit generated</td>
            <td>{date("2026-08-19")}</td>
            <td>Audit log is available for export.</td>
            <td>
              <Badge>Completed</Badge>
            </td>
          </tr>
        </DataTable>
      </Card>
    </>
  );
}
function SettingsPage() {
  const [saved, setSaved] = useState(false);
  return (
    <>
      <PageHeading
        title="Settings"
        subtitle="Application preferences and basic administrative configuration."
      />
      <div className="settings-grid">
        <Card>
          <h2>General information</h2>
          <div className="form-grid">
            <Input label="Application name" defaultValue="BanqueApp" />
            <Input
              label="Support email"
              type="email"
              defaultValue="contact@banqueapp.com"
            />
            <Input label="Phone" defaultValue="+212 522-000000" />
            <Input label="Location" defaultValue="Casablanca, Morocco" />
          </div>
        </Card>
        <Card>
          <h2>Notification preferences</h2>
          {["Platform activity", "New loan activity", "Repayment activity"].map(
            (label, i) => (
              <label className="toggle" key={label}>
                <span>{label}</span>
                <input defaultChecked={i < 2} type="checkbox" />
                <i />
              </label>
            ),
          )}
        </Card>
        <Card>
          <h2>Application preferences</h2>
          <div className="form-grid">
            <Select label="Language" defaultValue="en">
              <option value="en">English</option>
              <option value="fr">French</option>
            </Select>
            <Select label="Currency" defaultValue="MAD">
              <option value="MAD">MAD — Moroccan Dirham</option>
            </Select>
          </div>
          <Button onClick={() => setSaved(true)}>Save preferences</Button>
          {saved && <p className="success-text">Preferences saved locally.</p>}
        </Card>
      </div>
    </>
  );
}
function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      detail="Use the sidebar to return to BanqueApp administration."
    />
  );
}
export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/new" element={<ClientForm />} />
        <Route path="/clients/:clientId" element={<ClientDetails />} />
        <Route path="/clients/:clientId/edit" element={<ClientForm />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/loans/new" element={<AddLoanWorkflow />} />
        <Route path="/loans/:loanId" element={<LoanDetails />} />
        <Route path="/loans/:loanId/edit" element={<LoanForm />} />
        <Route path="/loans/:loanId/payments" element={<PaymentsPage />} />
        <Route
          path="/clients/:clientId/loans/:loanId"
          element={<LoanDetails />}
        />
        <Route
          path="/clients/:clientId/loans/:loanId/payments"
          element={<PaymentsPage />}
        />
        <Route path="/reports" element={<Reports />} />
        <Route path="/security" element={<Security />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

// Transitional exports keep the reviewed interface stable while each public concern now has its own entry module.
export {
  ClientsPage,
  ClientForm,
  ClientDetails,
  LoansPage,
  LoanDetails,
  LoanForm,
  PaymentsPage,
  AddLoanWorkflow,
  Reports,
  Security,
  SettingsPage,
  NotFound,
  NotificationCenter,
  LoanTable,
};
