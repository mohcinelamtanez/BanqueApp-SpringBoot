// Mock authentication — the ONLY file that needs to change when the real
// backend is connected. Every consumer (AuthContext, LoginPage,
// ForgotPasswordPage) only calls authService.login/requestPasswordReset and
// handles the returned Promise, so swapping these internals for real
// axios/httpClient calls to the Spring Boot API requires no changes
// anywhere else.
import { ROLES } from "./currentUser";

const MOCK_USERS = [
  {
    id: "USR-MOCK-ADMIN",
    firstName: "Admin",
    lastName: "Account",
    email: "admin@banqueapp.com",
    role: ROLES.ADMIN,
    password: "password",
  },
  {
    id: "USR-MOCK-AGENT",
    firstName: "Bank",
    lastName: "Agent",
    email: "agent@banqueapp.com",
    role: ROLES.BANK_AGENT,
    password: "password",
  },
  {
    id: "USR-MOCK-CLIENT",
    firstName: "Client",
    lastName: "Account",
    email: "client@banqueapp.com",
    role: ROLES.CLIENT,
    password: "password",
  },
];

const wait = (value, delay = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(value), delay));

export const authService = {
  login: async (email, password) => {
    await wait(null);
    const match = MOCK_USERS.find(
      (candidate) =>
        candidate.email.toLowerCase() === String(email).trim().toLowerCase() &&
        candidate.password === password,
    );
    if (!match) {
      throw new Error("Invalid email or password.");
    }
    const { password: _password, ...user } = match;
    return user;
  },
  requestPasswordReset: async (email) => {
    await wait(null);
    // Frontend-only simulation — always "succeeds" regardless of whether the
    // email matches a mock account, matching real-world behavior that never
    // reveals whether an email is registered.
    return { email };
  },
};
export default authService;
