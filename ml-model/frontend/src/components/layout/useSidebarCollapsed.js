import { useEffect, useState } from "react";

// Shared by AdminLayout and ClientLayout so the desktop collapse/expand
// preference behaves identically (and persists across reloads) regardless
// of which role's layout is currently mounted. Only one of those layouts is
// ever mounted at a time (see App.jsx), so a plain localStorage-backed
// useState is enough — no cross-tab/live-sync store is needed here.
const STORAGE_KEY = "banqueapp.sidebar.collapsed";
const isBrowser = typeof window !== "undefined";

function readStored() {
  if (!isBrowser) return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(readStored);

  useEffect(() => {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      /* ignore storage failures (private browsing, storage disabled, …) */
    }
  }, [collapsed]);

  return [collapsed, setCollapsed];
}
