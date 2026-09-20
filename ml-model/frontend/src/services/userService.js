import { httpClient } from "./httpClient";

const BASE = "/v1/users";

// The User entity only ever has email/role/enabled — there is no
// firstName/lastName/phone/lastLogin on the backend, so none of that is
// invented here.
function fromDTO(dto) {
  return {
    id: dto.id,
    email: dto.email,
    role: dto.role,
    status: dto.enabled ? "Active" : "Inactive",
  };
}

export const userService = {
  // Admin-only — every user account, for the User Management list/KPIs.
  list: () => httpClient.get(BASE).then((res) => res.data.map(fromDTO)),
  // Add User — creates a real account with the chosen role (Admin, Bank
  // Agent or Client). Only email/password/role are real backend fields;
  // the form's firstName/lastName/phone aren't tracked by the User entity
  // and are simply not sent.
  create: (values) =>
    httpClient
      .post(BASE, {
        email: values.email,
        password: values.tempPassword,
        role: values.role,
      })
      .then((res) => fromDTO(res.data)),
  // Assigns a role to an existing user — always exactly one of BANK_AGENT
  // or CLIENT (the backend rejects anything else, ADMIN included).
  assignRole: (id, role) =>
    httpClient
      .put(`${BASE}/${id}/role`, { role })
      .then((res) => fromDTO(res.data)),
  // No backend endpoint exists for editing a user's profile details
  // (name/phone) or toggling status — this stays an honest rejection
  // rather than a fake success.
  get: () => Promise.resolve(null),
  update: () =>
    Promise.reject(new Error("User management is not connected to the backend yet.")),
};
export default userService;
