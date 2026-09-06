import { httpClient } from "../services/httpClient";

// Talks to the real backend now — POST /api/v1/auth/login (AuthController),
// backed by UserService.signIn(...) + the JWT issued from JwtUtil. The
// three seeded accounts (AuthDataSeeder, backend-side) are:
//   admin@banqueapp.com / agent@banqueapp.com / client@banqueapp.com,
//   password: "password" for all three.
export const authService = {
  login: async (email, password) => {
    try {
      const { data } = await httpClient.post("/v1/auth/login", {
        email,
        password,
      });
      return {
        email: data.email,
        role: data.role,
        clientReference: data.clientReference,
        token: data.token,
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Invalid email or password.");
      }
      throw new Error(
        error.response?.data?.message || "Unable to sign in. Please try again.",
      );
    }
  },
  // No password-reset endpoint exists on the backend yet — this stays a
  // frontend-only simulation (never reveals whether an email is
  // registered, matching real-world behavior) until one is added.
  requestPasswordReset: async (email) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { email };
  },
  // Public self-registration — always creates a CLIENT-role account (the
  // backend assigns the role; there is no way to request another one from
  // here). Does not log the user in — they sign in separately afterward.
  register: async (email, password) => {
    try {
      const { data } = await httpClient.post("/v1/auth/register", {
        email,
        password,
      });
      return { email: data.email, role: data.role };
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error(
          error.response?.data?.message ||
            "An account with this email already exists.",
        );
      }
      throw new Error(
        error.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    }
  },
};
export default authService;
