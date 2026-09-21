import { useState } from "react";
import {
  Bell,
  BellOff,
  CheckCheck,
  CircleCheck,
  CircleX,
  Clock,
  FilePlus2,
  TriangleAlert,
  X,
} from "lucide-react";

// One tone + icon per notification kind. Backend types come through as-is;
// "payment" is the local payment-reminder simulation shown to clients.
const KINDS = {
  NEW_LOAN_APPLICATION: { tone: "info", Icon: FilePlus2 },
  LOAN_APPROVED: { tone: "success", Icon: CircleCheck },
  LOAN_REJECTED: { tone: "danger", Icon: CircleX },
  PAYMENT_DUE: { tone: "warning", Icon: Clock },
  PAYMENT_LATE: { tone: "danger", Icon: TriangleAlert },
  payment: { tone: "warning", Icon: Clock },
};
const FALLBACK_KIND = { tone: "info", Icon: Bell };

export default function NotificationCenter({
  onClose,
  notifications = [],
  onSelect,
  onMarkAllRead,
}) {
  const [filter, setFilter] = useState("all");
  const unreadCount = notifications.filter((item) => item.unread).length;
  // Only backend notifications (numeric id) can be marked as read.
  const canMarkAll =
    Boolean(onMarkAllRead) &&
    notifications.some((item) => item.unread && typeof item.id === "number");
  const visible =
    filter === "unread"
      ? notifications.filter((item) => item.unread)
      : notifications;

  return (
    <section className="notification-center">
      <header>
        <h3>
          Notifications
          {unreadCount > 0 && <small>{unreadCount} new</small>}
        </h3>
        <div className="nc-actions">
          {canMarkAll && (
            <button type="button" className="nc-link" onClick={onMarkAllRead}>
              <CheckCheck size={14} /> Mark all as read
            </button>
          )}
          <button
            type="button"
            className="nc-close"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <X size={17} />
          </button>
        </div>
      </header>
      <div className="nc-tabs">
        <button
          type="button"
          className={filter === "all" ? "nc-tab on" : "nc-tab"}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={filter === "unread" ? "nc-tab on" : "nc-tab"}
          onClick={() => setFilter("unread")}
        >
          Unread
        </button>
      </div>
      {visible.length === 0 ? (
        <div className="nc-empty">
          <BellOff size={22} />
          <p>{filter === "unread" ? "You're all caught up." : "No notifications."}</p>
        </div>
      ) : (
        <div className="notification-list">
          {visible.map((item) => {
            const { tone, Icon } = KINDS[item.kind] || FALLBACK_KIND;
            const classes = ["nc-item", `nc-${tone}`];
            if (item.unread) classes.push("unread");
            if (onSelect) classes.push("clickable");
            return (
              <article
                key={item.id}
                className={classes.join(" ")}
                onClick={() => onSelect?.(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect?.(item);
                  }
                }}
                role={onSelect ? "button" : undefined}
                tabIndex={onSelect ? 0 : undefined}
              >
                <span className="nc-icon">
                  <Icon size={18} />
                </span>
                <div className="nc-body">
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                  <small>{item.time}</small>
                </div>
                {item.unread && <span className="nc-dot" />}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
export { NotificationCenter };
