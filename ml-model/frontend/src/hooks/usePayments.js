import { useResource } from "./useResource";
import { paymentService } from "../services/paymentService";
export const usePayments = (loanId) => useResource(paymentService.list, loanId);
