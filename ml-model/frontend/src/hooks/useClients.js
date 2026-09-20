import { useResource } from "./useResource";
import { clientService } from "../services/clientService";
// `refreshKey` is ignored by clientService.list itself — bumping it is just
// how callers (e.g. after a create/edit/delete) force useResource's effect
// to refetch, since useResource only re-runs when its `id` argument changes.
export const useClients = (refreshKey) =>
  useResource(clientService.list, refreshKey);
// `reference` is falsy on the "Add Client" form (nothing to load yet) — skip
// the network call entirely rather than requesting "reference/null".
export const useClient = (reference, refreshKey) =>
  useResource(
    reference ? clientService.get : () => Promise.resolve(null),
    reference,
    [refreshKey],
  );
