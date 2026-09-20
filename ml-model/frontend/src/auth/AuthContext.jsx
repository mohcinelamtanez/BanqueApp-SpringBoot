import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { authService } from "./authService";
import { getUser, setUser, subscribe } from "./authStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const user = useSyncExternalStore(subscribe, getUser, getUser);

  const login = useCallback(async (email, password, remember = true) => {
    const authenticated = await authService.login(email, password);
    setUser(authenticated, remember);
    return authenticated;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
