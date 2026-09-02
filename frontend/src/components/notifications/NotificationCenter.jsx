import { X } from "lucide-react";
import { notifications as defaultNotifications } from "../../data/mock/data";
export default function NotificationCenter({
  onClose,
  notifications = defaultNotifications,
}) {
  return (
    <section className="notification-center">
      <header>
        <h3>Notifications</h3>
        <button onClick={onClose}>
          <X size={17} />
        </button>
      </header>
      {notifications.map((notification) => (
        <article key={notification.id}>
          <span className={notification.unread ? "dot" : ""} />
          <div>
            <b>{notification.title}</b>
            <p>{notification.text}</p>
            <small>{notification.time}</small>
          </div>
        </article>
      ))}
    </section>
  );
}
export { NotificationCenter };
