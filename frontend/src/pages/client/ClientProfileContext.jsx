import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { clientService } from "../../services/clientService";

// Single source of truth for "my Client profile" across the whole Client
// portal — Sidebar, Navbar and the My Profile page all read from here
// instead of each fetching clientService.getMine() independently. Calling
// refresh() (e.g. after My Profile saves a profile/photo edit) updates
// this shared state, which Sidebar/Navbar pick up automatically since they
// consume the same context value.
const ClientProfileContext = createContext(null);

export function ClientProfileProvider({ children }) {
  const [state, setState] = useState({ loading: true, client: null });

  const refresh = useCallback(() => {
    setState((current) => ({ ...current, loading: true }));
    return clientService
      .getMine()
      .then((client) => setState({ loading: false, client }))
      .catch(() => setState({ loading: false, client: null }));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ClientProfileContext.Provider value={{ ...state, refresh }}>
      {children}
    </ClientProfileContext.Provider>
  );
}

export function useClientProfile() {
  const context = useContext(ClientProfileContext);
  if (!context) {
    throw new Error("useClientProfile must be used within ClientProfileProvider");
  }
  return context;
}
