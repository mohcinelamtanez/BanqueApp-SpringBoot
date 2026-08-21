import { useResource } from "./useResource";
import { clientService } from "../services/clientService";
export const useClients = () => useResource(clientService.list);
