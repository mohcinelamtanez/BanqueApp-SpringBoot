import { Bell } from "lucide-react";

// The topbar bell with an unread-count badge. `ringKey` changes each time a
// new notification arrives: it remounts the icon so the ring animation
// restarts. Shared by the Admin and Client layouts.
export default function NotificationBell({
  count = 0,
  ringKey = 0,
  onClick,
  label = "Notifications",
}) {
  return (
    <button
      type="button"
      className="icon-button notification"
      onClick={onClick}
      aria-label={count > 0 ? `${label} (${count} unread)` : label}
    >
      <span key={ringKey} className={ringKey > 0 ? "nc-bell ringing" : "nc-bell"}>
        <Bell size={21} />
      </span>
      {count > 0 && <em className="nc-badge">{count > 9 ? "9+" : count}</em>}
    </button>
  );
}
export { NotificationBell };
