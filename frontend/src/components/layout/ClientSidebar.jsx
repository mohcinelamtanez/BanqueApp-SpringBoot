import { NavLink } from "react-router-dom";
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
  ["Dashboard", "/client/dashboard", LayoutDashboard],
  ["My Profile", "/client/profile", User],
  ["My Loans", "/client/loans", Banknote],
  ["My Applications", "/client/applications", FileText],
  ["Payments", "/client/payments", CreditCard],
  ["Settings", "/client/settings", Settings],
];

export default function ClientSidebar({ open, onClose }) {
  return (
    <aside className={open ? "sidebar open" : "sidebar"}>
      <div className="side-top">
        <Logo inverse />
        <button className="mobile-close" onClick={onClose}>
          <X />
        </button>
      </div>
      <nav>
        {links.map(([label, to, Icon]) => (
          <NavLink key={to} to={to} onClick={onClose}>
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
  );
}
export { ClientSidebar };
