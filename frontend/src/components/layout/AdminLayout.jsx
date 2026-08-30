import { useState } from "react";
import {
  Bell,
  Menu,
  Search,
  X,
  LayoutDashboard,
  Users,
  Banknote,
  BarChart3,
  Shield,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Logo } from "../ui";
import NotificationCenter from "../notifications/NotificationCenter";
const links = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Clients", "/clients", Users],
  ["Loans", "/loans", Banknote],
  ["Reports", "/reports", BarChart3],
  ["Security", "/security", Shield],
  ["Settings", "/settings", Settings],
];
export default function AdminLayout({ children }) {
  const [drawer, setDrawer] = useState(false);
  const [notifications, setNotifications] = useState(false);
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
          {links.map(([label, to, Icon]) => (
            <NavLink key={to} to={to} onClick={() => setDrawer(false)}>
              {({ isActive }) => (
                <>
                  <Icon size={24} fill={isActive ? "currentColor" : "none"} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="logout-wrap">
          <div className="logout">
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
