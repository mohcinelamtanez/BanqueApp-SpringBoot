import { useCallback, useEffect, useRef, useState } from "react";
import { notificationService } from "../services/notificationService";

const POLL_MS = 30000;

// The bell's data: an unread counter kept fresh by light polling, and the
// full list loaded when the panel opens (or when something new arrives).
// Failures are swallowed on purpose — notifications are a non-critical
// enhancement and must never break a page.
export function useNotifications() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  // Bumped every time the unread counter goes UP after the first reading, so
  // the bell can animate — page loads and read-actions never count.
  const [arrivals, setArrivals] = useState(0);
  const unreadRef = useRef(0);
  const baselined = useRef(false);

  const applyUnread = useCallback((count) => {
    if (baselined.current && count > unreadRef.current) {
      setArrivals((value) => value + 1);
    }
    baselined.current = true;
    unreadRef.current = count;
    setUnread(count);
  }, []);

  const refreshUnread = useCallback(() => {
    notificationService
      .unreadCount()
      .then(applyUnread)
      .catch(() => {});
  }, [applyUnread]);

  const refresh = useCallback(() => {
    notificationService
      .listMine()
      .then((list) => {
        setItems(list);
        applyUnread(list.filter((item) => item.unread).length);
      })
      .catch(() => {});
  }, [applyUnread]);

  useEffect(() => {
    refreshUnread();
    const timer = setInterval(refreshUnread, POLL_MS);
    return () => clearInterval(timer);
  }, [refreshUnread]);

  // Something new arrived: reload the list so an already-open panel shows it.
  useEffect(() => {
    if (arrivals > 0) refresh();
  }, [arrivals, refresh]);

  const markAsRead = useCallback(
    (id) => {
      setItems((list) =>
        list.map((item) => (item.id === id ? { ...item, unread: false } : item)),
      );
      applyUnread(Math.max(0, unreadRef.current - 1));
      notificationService.markAsRead(id).catch(refresh);
    },
    [applyUnread, refresh],
  );

  // No bulk endpoint exists — mark each unread notification individually.
  const markAllAsRead = useCallback(() => {
    const pending = items.filter((item) => item.unread).map((item) => item.id);
    if (pending.length === 0) return;
    setItems((list) => list.map((item) => ({ ...item, unread: false })));
    applyUnread(0);
    Promise.all(pending.map((id) => notificationService.markAsRead(id))).catch(
      refresh,
    );
  }, [items, applyUnread, refresh]);

  return { items, unread, arrivals, refresh, markAsRead, markAllAsRead };
}
