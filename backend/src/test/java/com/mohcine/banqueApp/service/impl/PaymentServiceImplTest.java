package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.Payment;
import com.mohcine.banqueApp.enums.LoanStatus;
import com.mohcine.banqueApp.enums.PaymentStatus;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.repository.PaymentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Covers the automatic Loan status transitions driven by payment status
 * changes: ACTIVE -> COMPLETED from markAsPaid(), and COMPLETED -> ACTIVE
 * from markAsUnpaid() when a previously-completed loan's payment is
 * reverted (e.g. correcting a mistake).
 */
@ExtendWith(MockitoExtension.class)
class PaymentServiceImplTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private LoanRepository loanRepository;

    private PaymentServiceImpl paymentService;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentServiceImpl(paymentRepository, loanRepository);
    }

    private Loan activeLoan(int id) {
        Loan loan = new Loan();
        loan.setId(id);
        loan.setStatus(LoanStatus.ACTIVE);
        return loan;
    }

    private Payment outstandingPayment(Loan loan) {
        Payment payment = new Payment();
        payment.setLoan(loan);
        payment.setStatus(PaymentStatus.OUTSTANDING);
        return payment;
    }

    // Scenario 2: Loan ACTIVE, only one unpaid payment remains -> marking
    // it PAID must transition the Loan to COMPLETED.
    @Test
    void markAsPaid_transitionsLoanToCompleted_whenNoUnpaidInstallmentsRemain() {
        Loan loan = activeLoan(1);
        Payment payment = outstandingPayment(loan);

        when(paymentRepository.findById(10)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(payment)).thenReturn(payment);
        when(paymentRepository.existsByLoan_IdAndStatusNot(1, PaymentStatus.PAID)).thenReturn(false);

        paymentService.markAsPaid(10);

        assertThat(loan.getStatus()).isEqualTo(LoanStatus.COMPLETED);
        verify(loanRepository).save(loan);
    }

    // Scenarios 1 & 3: Loan ACTIVE with other unpaid payments remaining ->
    // marking one of them PAID must leave the Loan ACTIVE.
    @Test
    void markAsPaid_keepsLoanActive_whenUnpaidInstallmentsRemain() {
        Loan loan = activeLoan(2);
        Payment payment = outstandingPayment(loan);

        when(paymentRepository.findById(20)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(payment)).thenReturn(payment);
        when(paymentRepository.existsByLoan_IdAndStatusNot(2, PaymentStatus.PAID)).thenReturn(true);

        paymentService.markAsPaid(20);

        assertThat(loan.getStatus()).isEqualTo(LoanStatus.ACTIVE);
        verify(loanRepository, never()).save(any(Loan.class));
    }

    // Re-marking an already-paid installment as paid on an already-
    // Completed Loan must be a pure no-op on the Loan itself — the guard
    // must short-circuit before even checking for remaining unpaid
    // installments.
    @Test
    void markAsPaid_doesNotTouchLoan_whenLoanAlreadyCompleted() {
        Loan loan = new Loan();
        loan.setId(3);
        loan.setStatus(LoanStatus.COMPLETED);
        Payment payment = outstandingPayment(loan);

        when(paymentRepository.findById(30)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(payment)).thenReturn(payment);

        paymentService.markAsPaid(30);

        assertThat(loan.getStatus()).isEqualTo(LoanStatus.COMPLETED);
        verify(loanRepository, never()).save(any(Loan.class));
        verify(paymentRepository, never()).existsByLoan_IdAndStatusNot(any(), any());
    }

    // If an Admin/Bank Agent reverts a payment back to unpaid on a Loan
    // that had already become COMPLETED, the loan is no longer actually
    // fully repaid and must go back to ACTIVE.
    @Test
    void markAsUnpaid_reactivatesLoan_whenLoanWasCompleted() {
        Loan loan = new Loan();
        loan.setId(4);
        loan.setStatus(LoanStatus.COMPLETED);
        Payment payment = new Payment();
        payment.setLoan(loan);
        payment.setStatus(PaymentStatus.PAID);

        when(paymentRepository.findById(40)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(payment)).thenReturn(payment);

        paymentService.markAsUnpaid(40);

        assertThat(loan.getStatus()).isEqualTo(LoanStatus.ACTIVE);
        verify(loanRepository).save(loan);
    }

    // Reverting a payment on a Loan that is already ACTIVE must not
    // trigger a redundant Loan write.
    @Test
    void markAsUnpaid_leavesLoanActive_withoutExtraWrite_whenLoanWasAlreadyActive() {
        Loan loan = activeLoan(5);
        Payment payment = new Payment();
        payment.setLoan(loan);
        payment.setStatus(PaymentStatus.PAID);

        when(paymentRepository.findById(50)).thenReturn(Optional.of(payment));
        when(paymentRepository.save(payment)).thenReturn(payment);

        paymentService.markAsUnpaid(50);

        assertThat(loan.getStatus()).isEqualTo(LoanStatus.ACTIVE);
        verify(loanRepository, never()).save(any(Loan.class));
    }
}
