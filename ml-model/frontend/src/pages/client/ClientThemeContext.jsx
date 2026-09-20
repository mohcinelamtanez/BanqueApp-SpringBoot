import { createContext, useContext, useEffect, useState } from "react";

// Frontend-only preference, scoped to the Client experience. Never sent to
// the API. Persisted in localStorage; resolved "system" follows the OS via
// matchMedia. The resolved value is applied as data-theme on ClientLayout's
// own root element (see ClientLayout.jsx / .client-shell CSS scope) so it
// can never affect Admin, which renders under a plain .app-shell.
const THEME_STORAGE_KEY = "banqueapp.client.theme";
const isBrowser = typeof window !== "undefined";

function readStoredPreference() {
  if (!isBrowser) return "system";
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) || "system";
  } catch {
    return "system";
  }
}

function resolveTheme(preference) {
  if (preference !== "system") return preference;
  if (!isBrowser || typeof window.matchMedia !== "function") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const ClientThemeContext = createContext(null);

export function ClientThemeProvider({ children }) {
  const [preference, setPreference] = useState(readStoredPreference);
  const [resolved, setResolved] = useState(() => resolveTheme(preference));

  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      /* ignore write failures (private browsing, storage disabled, …) */
    }
    setResolved(resolveTheme(preference));
    if (preference !== "system" || typeof window.matchMedia !== "function") {
      return undefined;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(resolveTheme("system"));
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  return (
    <ClientThemeContext.Provider value={{ preference, resolved, setPreference }}>
      {children}
    </ClientThemeContext.Provider>
  );
}

export function useClientTheme() {
  const context = useContext(ClientThemeContext);
  if (!context) {
    throw new Error("useClientTheme must be used within ClientThemeProvider");
  }
  return context;
}
