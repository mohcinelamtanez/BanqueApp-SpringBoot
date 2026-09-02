import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Menu, Search } from "lucide-react";
import "../../i18n";
import ClientSidebar from "./ClientSidebar";
import NotificationCenter from "../notifications/NotificationCenter";
import { useSidebarCollapsed } from "./useSidebarCollapsed";
import {
  ClientThemeProvider,
  useClientTheme,
} from "../../pages/client/ClientThemeContext";

function ClientLayoutShell({ children }) {
  const { t } = useTranslation();
  const { resolved } = useClientTheme();
  const [drawer, setDrawer] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  return (
    <div
      className={
        collapsed
          ? "app-shell client-shell sidebar-collapsed"
          : "app-shell client-shell"
      }
      data-theme={resolved}
    >
      <ClientSidebar
        open={drawer}
        onClose={() => setDrawer(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
      />
      <div className="page-shell">
        <header className="topbar">
          <button className="menu-button" onClick={() => setDrawer(true)}>
            <Menu />
          </button>
          <div className="search">
            <Search size={17} />
            <input
              placeholder={t("topbar.searchPlaceholder")}
              aria-label={t("topbar.searchPlaceholder")}
            />
          </div>
          <div className="topbar-actions">
            <button
              className="icon-button notification"
              onClick={() => setNotifications((value) => !value)}
              aria-label={t("topbar.notifications")}
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

export default function ClientLayout({ children }) {
  return (
    <ClientThemeProvider>
      <ClientLayoutShell>{children}</ClientLayoutShell>
    </ClientThemeProvider>
  );
}
export { ClientLayout };
