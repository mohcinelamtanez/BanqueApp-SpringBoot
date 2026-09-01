import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu,
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
import { isAdmin } from "../../auth/currentUser";
import { useAuth } from "../../auth/AuthContext";
const links = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Clients", "/clients", Users],
  ["Loans", "/loans", Banknote],
  ["Reports", "/reports", BarChart3],
  ["Security", "/security", Shield],
  ["Settings", "/settings", Settings],
];
const loanLinks = [
  ["Loan Management", "/loans"],
  ["Loan Applications", "/loan-applications"],
  ["Add New Loan", "/loans/new-loan", Plus],
];
export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const loansActive =
    location.pathname.startsWith("/loans") ||
    location.pathname.startsWith("/loan-applications");
  const [loansOpen, setLoansOpen] = useState(loansActive);
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
          {links.map(([label, to, Icon]) =>
            label === "Loans" ? (
              <div className="sidebar-group" key={to}>
                <button
                  type="button"
                  className={loansActive ? "active" : ""}
                  onClick={() => setLoansOpen((value) => !value)}
                  aria-expanded={loansOpen}
                >
                  <Icon size={24} fill={loansActive ? "currentColor" : "none"} />
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
              <NavLink key={to} to={to} onClick={() => setDrawer(false)}>
                {({ isActive }) => (
                  <>
                    <Icon
                      size={24}
                      fill={isActive ? "currentColor" : "none"}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ),
          )}
          {isAdmin() && (
            <NavLink to="/users" onClick={() => setDrawer(false)}>
              {({ isActive }) => (
                <>
                  <UserCog size={24} fill={isActive ? "currentColor" : "none"} />
                  <span>User Management</span>
                </>
              )}
            </NavLink>
          )}
        </nav>
        <div className="logout-wrap">
          <div
            className="logout"
            role="button"
            tabIndex={0}
            onClick={handleLogout}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleLogout();
              }
            }}
          >
            <LogOut size={24} />
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
