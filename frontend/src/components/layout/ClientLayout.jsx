import { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import ClientSidebar from "./ClientSidebar";
import NotificationCenter from "../notifications/NotificationCenter";

export default function ClientLayout({ children }) {
  const [drawer, setDrawer] = useState(false);
  const [notifications, setNotifications] = useState(false);
  return (
    <div className="app-shell">
      <ClientSidebar open={drawer} onClose={() => setDrawer(false)} />
      <div className="page-shell">
        <header className="topbar">
          <button className="menu-button" onClick={() => setDrawer(true)}>
            <Menu />
          </button>
          <div className="search">
            <Search size={17} />
            <input placeholder="Search…" aria-label="Search" />
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button notification"
              onClick={() => setNotifications((value) => !value)}
              aria-label="Notifications"
            >
              <Bell size={21} />
              <i />
            </button>
            <div className="avatar">CL</div>
            {notifications && (
              <NotificationCenter onClose={() => setNotifications(false)} />
            )}
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
export { ClientLayout };
