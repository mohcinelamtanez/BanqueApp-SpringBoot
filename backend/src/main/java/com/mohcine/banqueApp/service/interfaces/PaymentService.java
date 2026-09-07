package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.Payment;

import java.util.List;

/**
 * @author USER
 **/
public interface PaymentService {

    void createPayments(Loan loan);

    // Only generates the schedule the first time a loan reaches Active —
    // safe to call from both loan creation and loan status updates without
    // ever double-generating a client's installments.
    void generateScheduleIfMissing(Loan loan);

    List<Payment> getPaymentsByLoanId(Integer loanId);

    List<Payment> getPaymentsByClientReference(String clientReference);

    boolean hasSchedule(Integer loanId);

    // False once every installment on this loan is PAID — used to block a
    // client from applying for a new loan until the current one is settled.
    boolean hasUnpaidInstallments(Integer loanId);

    Payment markAsPaid(Integer paymentId);

    Payment markAsUnpaid(Integer paymentId);

    void deleteAllForLoan(Integer loanId);
}
