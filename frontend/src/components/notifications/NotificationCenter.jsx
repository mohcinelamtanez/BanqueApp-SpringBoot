import { X } from "lucide-react";
export default function NotificationCenter({ onClose, notifications = [] }) {
  return (
    <section className="notification-center">
      <header>
        <h3>Notifications</h3>
        <button onClick={onClose}>
          <X size={17} />
        </button>
      </header>
      {notifications.length === 0 ? (
        <p className="notification-empty">No notifications.</p>
      ) : (
        notifications.map((notification) => (
          <article key={notification.id}>
            <span className={notification.unread ? "dot" : ""} />
            <div>
              <b>{notification.title}</b>
              <p>{notification.text}</p>
              <small>{notification.time}</small>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
export { NotificationCenter };
