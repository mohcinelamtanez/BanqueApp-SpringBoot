import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Menu, Search } from "lucide-react";
import "../../i18n";
import ClientSidebar from "./ClientSidebar";
import NotificationCenter from "../notifications/NotificationCenter";
import { useSidebarCollapsed } from "./useSidebarCollapsed";
import { notifications as globalNotifications } from "../../data/mock/data";
import { loanService } from "../../services/loanService";
import { paymentService } from "../../services/paymentService";
import { buildPaymentNotifications } from "../../utils/paymentSchedule";
import { CURRENT_CLIENT_ID } from "../../pages/client/clientShared";
import {
  ClientThemeProvider,
  useClientTheme,
} from "../../pages/client/ClientThemeContext";

function ClientLayoutShell({ children }) {
  const { t } = useTranslation();
  const { resolved } = useClientTheme();
  const [drawer, setDrawer] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [paymentNotifications, setPaymentNotifications] = useState([]);

  useEffect(() => {
    let active = true;
    loanService.list().then(async (allLoans) => {
      const activeLoan = allLoans.find(
        (loan) => loan.clientId === CURRENT_CLIENT_ID && loan.status === "Active",
      );
      if (!activeLoan) return;
      const loanPayments = await paymentService.list(activeLoan.id);
      if (!active) return;
      // Frontend-only simulation of payment reminder notifications — no
      // real email/push is ever sent, this just feeds the existing bell.
      setPaymentNotifications(
        buildPaymentNotifications(activeLoan, loanPayments),
      );
    });
    return () => {
      active = false;
    };
  }, []);
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
              onClick={() => setNotificationsOpen((value) => !value)}
              aria-label={t("topbar.notifications")}
            >
              <Bell size={21} />
              <i />
            </button>
            <div className="avatar">CL</div>
            {notificationsOpen && (
              <NotificationCenter
                notifications={[...paymentNotifications, ...globalNotifications]}
                onClose={() => setNotificationsOpen(false)}
              />
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
