// Frontend-only mock of the authenticated user until real auth/JWT is wired
// in from the backend. Swap CURRENT_ROLE to preview the BANK_AGENT
// experience during development. When real authentication lands, replace
// this module's exports with values derived from the authenticated
// session — every consumer (AdminLayout, AppRoutes, UserManagementPage)
// only depends on this shape, not on how the role is obtained.
export const ROLES = { ADMIN: "ADMIN", BANK_AGENT: "BANK_AGENT" };

export const CURRENT_ROLE = ROLES.BANK_AGENT;

export const isAdmin = () => CURRENT_ROLE === ROLES.ADMIN;
