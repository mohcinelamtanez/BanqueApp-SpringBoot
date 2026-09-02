import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  X,
  LayoutDashboard,
  Users,
  Banknote,
  BarChart3,
  Shield,
  Settings,
  UserCog,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../ui";
import NotificationCenter from "../notifications/NotificationCenter";
import { isAdmin, ROLES } from "../../auth/currentUser";
import { useAuth } from "../../auth/AuthContext";
import { useSidebarCollapsed } from "./useSidebarCollapsed";
const navGroups = [
  {
    label: "OVERVIEW",
    links: [["Dashboard", "/dashboard", LayoutDashboard]],
  },
  {
    label: "MANAGEMENT",
    links: [
      ["Clients", "/clients", Users],
      ["Loans", "/loans", Banknote],
      ["Reports", "/reports", BarChart3],
    ],
  },
  {
    label: "SYSTEM",
    links: [
      ["Security", "/security", Shield],
      ["Settings", "/settings", Settings],
    ],
  },
];
const loanLinks = [
  ["Loan Management", "/loans"],
  ["Loan Applications", "/loan-applications"],
  ["Add New Loan", "/loans/new-loan", Plus],
];
const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.BANK_AGENT]: "Bank Agent",
  [ROLES.CLIENT]: "Client",
};
export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const loansActive =
    location.pathname.startsWith("/loans") ||
    location.pathname.startsWith("/loan-applications");
  const [loansOpen, setLoansOpen] = useState(loansActive);
  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";
  const roleLabel = user ? ROLE_LABELS[user.role] ?? user.role : "";
  return (
    <div className={collapsed ? "app-shell sidebar-collapsed" : "app-shell"}>
      <aside
        className={`sidebar${drawer ? " open" : ""}${collapsed ? " collapsed" : ""}`}
      >
        <div className="side-top">
          <Logo inverse />
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          <button className="mobile-close" onClick={() => setDrawer(false)}>
            <X />
          </button>
        </div>
        <nav>
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="nav-section-label">{group.label}</p>
              {group.links.map(([label, to, Icon]) =>
                label === "Loans" ? (
                  <div className="sidebar-group" key={to}>
                    <button
                      type="button"
                      className={loansActive ? "active" : ""}
                      onClick={() => setLoansOpen((value) => !value)}
                      aria-expanded={loansOpen}
                      title={collapsed ? label : undefined}
                    >
                      <Icon size={18} />
                      <span>{label}</span>
                      <ChevronDown
                        size={16}
                        className={loansOpen ? "chevron open" : "chevron"}
                      />
                    </button>
                    <div className={loansOpen ? "submenu open" : "submenu"}>
                      {loanLinks.map(([childLabel, childTo, ChildIcon]) => (
                        <NavLink
                          key={childTo}
                          to={childTo}
                          end={childTo === "/loans"}
                          onClick={() => setDrawer(false)}
                          className={ChildIcon ? "submenu-action" : undefined}
                        >
                          {ChildIcon && <ChildIcon size={14} />}
                          <span>{childLabel}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setDrawer(false)}
                    title={collapsed ? label : undefined}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ),
              )}
              {group.label === "SYSTEM" && isAdmin() && (
                <NavLink
                  to="/users"
                  onClick={() => setDrawer(false)}
                  title={collapsed ? "User Management" : undefined}
                >
                  <UserCog size={18} />
                  <span>User Management</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-profile" title={collapsed ? fullName : undefined}>
            <span className="sidebar-profile-avatar">{initials}</span>
            <span className="sidebar-profile-info">
              <span className="sidebar-profile-name">{fullName}</span>
              <span className="sidebar-profile-role">{roleLabel}</span>
            </span>
            <MoreVertical
              size={16}
              className="sidebar-profile-more"
              aria-hidden="true"
            />
          </div>
          <div
            className="logout"
            role="button"
            tabIndex={0}
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleLogout();
              }
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
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
            onClick={() => setNotifications((value) => !value)}
            aria-label="Notifications"
          >
            <Bell size={21} />
            <i />
          </button>
          <div className="avatar">BA</div>
          {notifications && (
            <NotificationCenter onClose={() => setNotifications(false)} />
          )}
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
export { AdminLayout };
