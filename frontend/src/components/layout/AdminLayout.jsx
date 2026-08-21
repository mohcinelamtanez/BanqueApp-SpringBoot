import { useState } from "react";
import { Bell, Menu, Search, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Logo } from "../ui";
import NotificationCenter from "../notifications/NotificationCenter";
const links = [
  ["Dashboard", "/dashboard"],
  ["Clients", "/clients"],
  ["Loans", "/loans"],
  ["Reports", "/reports"],
  ["Security", "/security"],
  ["Settings", "/settings"],
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
          {links.map(([label, to]) => (
            <NavLink key={to} to={to} onClick={() => setDrawer(false)}>
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
