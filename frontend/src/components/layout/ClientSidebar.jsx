import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  ["nav.dashboard", "/client/dashboard", LayoutDashboard],
  ["nav.profile", "/client/profile", User],
  ["nav.loans", "/client/loans", Banknote],
  ["nav.applications", "/client/applications", FileText],
  ["nav.payments", "/client/payments", CreditCard],
  ["nav.settings", "/client/settings", Settings],
];

export default function ClientSidebar({ open, onClose }) {
  const { t } = useTranslation();
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
        <div className="logout">
          <LogOut size={24} />
          <span>{t("nav.logout")}</span>
        </div>
      </div>
    </aside>
  );
}
export { ClientSidebar };
