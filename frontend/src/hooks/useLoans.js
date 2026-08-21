import { useResource } from "./useResource";
import { loanService } from "../services/loanService";
export const useLoans = () => useResource(loanService.list);
export const useLoan = (id) => useResource(loanService.get, id);
