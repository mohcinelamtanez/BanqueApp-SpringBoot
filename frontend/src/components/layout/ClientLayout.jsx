import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell, Menu, Search } from "lucide-react";
import "../../i18n";
import ClientSidebar from "./ClientSidebar";
import ClientAvatar from "../clients/ClientAvatar";
import NotificationCenter from "../notifications/NotificationCenter";
import { useSidebarCollapsed } from "./useSidebarCollapsed";
import { loanService } from "../../services/loanService";
import { paymentService } from "../../services/paymentService";
import { buildPaymentNotifications } from "../../utils/paymentSchedule";
import { initials } from "../../pages/pageShared";
import {
  ClientProfileProvider,
  useClientProfile,
} from "../../pages/client/ClientProfileContext";
import {
  ClientThemeProvider,
  useClientTheme,
} from "../../pages/client/ClientThemeContext";

function ClientLayoutShell({ children }) {
  const { t } = useTranslation();
  const { resolved } = useClientTheme();
  const { client } = useClientProfile();
  const [drawer, setDrawer] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [paymentNotifications, setPaymentNotifications] = useState([]);

  useEffect(() => {
    let active = true;
    // Was loanService.list()/paymentService.list(loanId) — both are now
    // Admin/Bank Agent-only endpoints (see SpringSecurityConfig), so this
    // silently 403'd for every client and never populated the bell. .listMine()
    // is scoped server-side to the authenticated client already, and simply
    // 404s (caught below) rather than erroring for a user with no linked
    // Client yet — that's an expected state, not a real failure.
    Promise.all([loanService.listMine(), paymentService.listMine()])
      .then(([myLoans, myPayments]) => {
        if (!active) return;
        const activeLoan = myLoans.find((loan) => loan.status === "Active");
        if (!activeLoan) return;
        const loanPayments = myPayments.filter(
          (payment) => payment.loanId === activeLoan.id,
        );
        // Frontend-only simulation of payment reminder notifications — no
        // real email/push is ever sent, this just feeds the existing bell.
        setPaymentNotifications(
          buildPaymentNotifications(activeLoan, loanPayments),
        );
      })
      .catch(() => {
        // No Client yet (404) or a transient failure — the bell just stays
        // empty either way, this is a non-critical enhancement.
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
            <ClientAvatar
              profilePhotoUrl={client?.profilePhotoUrl}
              initials={client ? initials(client.name) : "CL"}
              className="avatar"
            />
            {notificationsOpen && (
              <NotificationCenter
                notifications={paymentNotifications}
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
      <ClientProfileProvider>
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </ClientProfileProvider>
    </ClientThemeProvider>
  );
}
export { ClientLayout };
