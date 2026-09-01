// Plain (non-React) store holding the authenticated user, so it can be read
// synchronously both by React (via AuthContext's useSyncExternalStore) and
// by the existing plain role helpers (isAdmin/isClient in currentUser.js)
// without needing every call site to become a hook. This is the only place
// that touches storage — swap it out (or point it at real session state)
// when the backend lands, and every consumer keeps working unchanged.
const STORAGE_KEY = "banqueapp.auth.user";
const isBrowser = typeof window !== "undefined";
const listeners = new Set();

function readStoredUser() {
  if (!isBrowser) return null;
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ||
      window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let currentUser = readStoredUser();

export function getUser() {
  return currentUser;
}

// remember=true persists across browser restarts (localStorage);
// remember=false only survives the current tab/session (sessionStorage) —
// this is what backs the Login page's "Remember me" checkbox.
export function setUser(user, remember = true) {
  currentUser = user;
  if (isBrowser) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      if (user) {
        const storage = remember ? window.localStorage : window.sessionStorage;
        storage.setItem(STORAGE_KEY, JSON.stringify(user));
      }
    } catch {
      /* ignore storage failures (private browsing, storage disabled, …) */
    }
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
