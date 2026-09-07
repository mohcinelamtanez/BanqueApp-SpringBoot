// No backend endpoint exists yet for user management (no UserController on
// the API) — these intentionally resolve to empty/no-op results rather than
// hitting a nonexistent endpoint or inventing mock data.
export const userService = {
  list: () => Promise.resolve([]),
  get: () => Promise.resolve(null),
  create: () =>
    Promise.reject(new Error("User management is not connected to the backend yet.")),
  update: () =>
    Promise.reject(new Error("User management is not connected to the backend yet.")),
};
export default userService;
