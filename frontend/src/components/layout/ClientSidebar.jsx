import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth/AuthContext";
import {
  Banknote,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  X,
} from "lucide-react";
import { Logo } from "../ui";

const links = [
  ["nav.dashboard", "/dashboard", LayoutDashboard],
  ["nav.profile", "/my-profile", User],
  ["nav.loans", "/my-loans", Banknote],
  ["nav.applications", "/my-applications", FileText],
  ["nav.payments", "/my-payments", CreditCard],
  ["nav.settings", "/settings", Settings],
];

export default function ClientSidebar({ open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <aside className={open ? "sidebar open" : "sidebar"}>
      <div className="side-top">
        <Logo inverse />
        <button className="mobile-close" onClick={onClose}>
          <X />
        </button>
      </div>
      <nav>
        {links.map(([labelKey, to, Icon]) => (
          <NavLink key={to} to={to} onClick={onClose}>
            {({ isActive }) => (
              <>
                <Icon size={24} fill={isActive ? "currentColor" : "none"} />
                <span>{t(labelKey)}</span>
              </>
            )}
          </NavLink>
        ))}
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
          <span>{t("nav.logout")}</span>
        </div>
      </div>
    </aside>
  );
}
export { ClientSidebar };
