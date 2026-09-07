// Role helpers backed by the real authenticated user in authStore. Every
// consumer (AdminLayout, AppRoutes, UserManagementPage) only depends on
// this shape, not on how the role is obtained.
import { getUser } from "./authStore";

export const ROLES = {
  ADMIN: "ADMIN",
  BANK_AGENT: "BANK_AGENT",
  CLIENT: "CLIENT",
};

export const isAdmin = () => getUser()?.role === ROLES.ADMIN;
export const isClient = () => getUser()?.role === ROLES.CLIENT;
