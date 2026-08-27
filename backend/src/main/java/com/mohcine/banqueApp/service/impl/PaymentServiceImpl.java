package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.Payment;
import com.mohcine.banqueApp.enums.PaymentStatus;
import com.mohcine.banqueApp.repository.PaymentRepository;
import com.mohcine.banqueApp.service.interfaces.PaymentService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * @author USER
 **/
@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public void createPayments(Loan loan) {

        for (int i = 1; i <= loan.getDuration(); i++) {

            Payment payment = new Payment();

            payment.setLoan(loan);
            payment.setInstallmentNumber(i);
            payment.setAmount(loan.getMonthlyPayment());
            payment.setPaymentDate(LocalDate.now());
            payment.setDueDate(LocalDate.now().plusDays(i));
            payment.setStatus(PaymentStatus.OUTSTANDING);
            paymentRepository.save(payment);
        }
    }
}
