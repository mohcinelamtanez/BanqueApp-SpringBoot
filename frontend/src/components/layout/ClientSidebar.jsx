import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import { useClientProfile } from "../../pages/client/ClientProfileContext";
import { initials } from "../../pages/pageShared";
import { ROLES } from "../../auth/currentUser";
import ClientAvatar from "../clients/ClientAvatar";
import {
  Banknote,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  X,
} from "lucide-react";
import { Logo } from "../ui";

const navGroups = [
  {
    label: "OVERVIEW",
    links: [["nav.dashboard", "/dashboard", LayoutDashboard]],
  },
  {
    label: "MY FINANCES",
    links: [
      ["nav.loans", "/my-loans", Banknote],
      ["nav.applications", "/my-applications", FileText],
      ["nav.payments", "/my-payments", CreditCard],
    ],
  },
  {
    label: "ACCOUNT",
    links: [
      ["nav.profile", "/my-profile", User],
      ["nav.settings", "/settings", Settings],
    ],
  },
];

const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.BANK_AGENT]: "Bank Agent",
  [ROLES.CLIENT]: "Client",
};

export default function ClientSidebar({
  open,
  onClose,
  collapsed = false,
  onToggleCollapse,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // Single shared source (ClientProfileProvider, mounted in ClientLayout) —
  // the Navbar avatar reads the exact same state, so both always agree and
  // neither fetches the profile on its own.
  const { client } = useClientProfile();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  // The Client's real name is preferred over the account email. Falling
  // back to the email only covers the brief bootstrapping window before a
  // Client profile exists yet (e.g. right after Sign Up, before "My
  // Profile" has been completed) — there is no name to show at all yet.
  const fullName = client ? client.name : (user?.email ?? "");
  const avatarInitials = client
    ? initials(client.name)
    : user?.email?.[0]?.toUpperCase() || "";
  const roleLabel = user ? ROLE_LABELS[user.role] ?? user.role : "";
  return (
    <aside
      className={`sidebar${open ? " open" : ""}${collapsed ? " collapsed" : ""}`}
    >
      <div className="side-top">
        <Logo inverse />
        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
        <button className="mobile-close" onClick={onClose}>
          <X />
        </button>
      </div>
      <nav>
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="nav-section-label">{group.label}</p>
            {group.links.map(([labelKey, to, Icon]) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                title={collapsed ? t(labelKey) : undefined}
              >
                <Icon size={18} />
                <span>{t(labelKey)}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-profile" title={collapsed ? fullName : undefined}>
          <ClientAvatar
            profilePhotoUrl={client?.profilePhotoUrl}
            initials={avatarInitials}
            className="sidebar-profile-avatar"
          />
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
          title={collapsed ? t("nav.logout") : undefined}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleLogout();
            }
          }}
        >
          <LogOut size={18} />
          <span>{t("nav.logout")}</span>
        </div>
      </div>
    </aside>
  );
}
export { ClientSidebar };
