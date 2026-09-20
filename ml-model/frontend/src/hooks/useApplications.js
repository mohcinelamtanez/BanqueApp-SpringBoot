import { useResource } from "./useResource";
import { applicationService } from "../services/applicationService";
export const useApplications = (refreshKey) =>
  useResource(applicationService.list, undefined, [refreshKey]);
export const useApplication = (id) =>
  useResource(id ? applicationService.get : () => Promise.resolve(null), id);
