import { useResource } from "./useResource";
import { loanService } from "../services/loanService";
export const useLoans = (refreshKey) =>
  useResource(loanService.list, undefined, [refreshKey]);
// `id` is falsy while a page hasn't resolved what to load yet (e.g. the
// "Add Loan" form, or a loan's client before the loan itself has loaded) —
// skip the network call entirely rather than fetching every loan for
// nothing.
export const useLoan = (id) =>
  useResource(id ? loanService.get : () => Promise.resolve(null), id);
