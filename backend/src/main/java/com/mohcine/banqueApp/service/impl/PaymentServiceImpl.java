package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.Payment;
import com.mohcine.banqueApp.enums.LoanStatus;
import com.mohcine.banqueApp.enums.PaymentStatus;
import com.mohcine.banqueApp.exception.PaymentNotFoundException;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.repository.PaymentRepository;
import com.mohcine.banqueApp.service.interfaces.PaymentService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * @author USER
 **/
@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final LoanRepository loanRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository, LoanRepository loanRepository) {
        this.paymentRepository = paymentRepository;
        this.loanRepository = loanRepository;
    }

    @Override
    public void createPayments(Loan loan) {
        // Anchored on the loan's own approval date, one installment per
        // month of its duration — not "today + i days", which crammed a
        // 48-month schedule into the next 48 days.
        LocalDate anchor = loan.getApprovalDate().toLocalDate();
        String referenceBase = "PAY-" + loan.getId();

        for (int i = 1; i <= loan.getDuration(); i++) {

            Payment payment = new Payment();

            payment.setLoan(loan);
            payment.setPaymentReference(referenceBase + "-" + i);
            payment.setInstallmentNumber(i);
            payment.setAmount(loan.getMonthlyPayment());
            payment.setDueDate(anchor.plusMonths(i));
            // No payment has actually happened yet — paymentDate must stay
            // null until markAsPaid() is called, not be stamped "today" for
            // every future installment.
            payment.setPaymentDate(null);
            payment.setStatus(PaymentStatus.OUTSTANDING);
            paymentRepository.save(payment);
        }
    }

    @Override
    public void generateScheduleIfMissing(Loan loan) {
        if (paymentRepository.existsByLoan_Id(loan.getId())) {
            return;
        }
        createPayments(loan);
    }

    @Override
    public List<Payment> getPaymentsByLoanId(Integer loanId) {
        return paymentRepository.findByLoan_Id(loanId);
    }

    @Override
    public List<Payment> getPaymentsByClientReference(String clientReference) {
        return paymentRepository.findByLoan_Client_ClientReference(clientReference);
    }

    @Override
    public boolean hasSchedule(Integer loanId) {
        return paymentRepository.existsByLoan_Id(loanId);
    }

    @Override
    public boolean hasUnpaidInstallments(Integer loanId) {
        return paymentRepository.existsByLoan_IdAndStatusNot(loanId, PaymentStatus.PAID);
    }

    @Override
    @Transactional
    public Payment markAsPaid(Integer paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));
        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDate.now());
        Payment savedPayment = paymentRepository.save(payment);
        completeLoanIfFullyPaid(payment.getLoan());
        return savedPayment;
    }

    // A Loan stays ACTIVE until every one of its installments is PAID — the
    // moment the last one is, it automatically becomes COMPLETED. Reuses
    // the same existsByLoan_IdAndStatusNot query hasUnpaidInstallments()
    // already exposes, so "all paid" is defined in exactly one place. Only
    // an ACTIVE loan can transition this way: a Rejected loan never has
    // payments, and a Completed loan is already terminal.
    private void completeLoanIfFullyPaid(Loan loan) {
        if (loan.getStatus() != LoanStatus.ACTIVE) {
            return;
        }
        if (!hasUnpaidInstallments(loan.getId())) {
            loan.setStatus(LoanStatus.COMPLETED);
            loanRepository.save(loan);
        }
    }

    @Override
    @Transactional
    public Payment markAsUnpaid(Integer paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));
        payment.setStatus(PaymentStatus.OUTSTANDING);
        payment.setPaymentDate(null);
        Payment savedPayment = paymentRepository.save(payment);
        reactivateLoanIfNoLongerFullyPaid(payment.getLoan());
        return savedPayment;
    }

    // Mirror of completeLoanIfFullyPaid(): if an Admin/Bank Agent reverts a
    // payment on a Completed loan back to unpaid (correcting a mistake, or
    // any other reason), the loan is no longer actually fully repaid and
    // must go back to ACTIVE. A Rejected loan is untouched — it never has
    // payments in the first place, so this never applies to one.
    private void reactivateLoanIfNoLongerFullyPaid(Loan loan) {
        if (loan.getStatus() == LoanStatus.COMPLETED) {
            loan.setStatus(LoanStatus.ACTIVE);
            loanRepository.save(loan);
        }
    }

    @Override
    public void deleteAllForLoan(Integer loanId) {
        paymentRepository.deleteByLoan_Id(loanId);
    }
}
