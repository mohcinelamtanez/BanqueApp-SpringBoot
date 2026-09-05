package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.PaymentResponseDTO;
import com.mohcine.banqueApp.entity.Payment;
import com.mohcine.banqueApp.enums.PaymentStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * @author USER
 **/
@Component
public class PaymentMapper {

    public PaymentResponseDTO toDTO(Payment payment) {
        return new PaymentResponseDTO(
                payment.getId(),
                payment.getPaymentReference(),
                payment.getLoan() != null ? payment.getLoan().getId() : null,
                payment.getInstallmentNumber(),
                payment.getAmount(),
                payment.getDueDate(),
                payment.getPaymentDate(),
                effectiveStatus(payment),
                payment.getDescription()
        );
    }

    // PAID is a hard fact once recorded; anything still OUTSTANDING past its
    // due date is reported as OVERDUE without needing a scheduled job to
    // flip the stored status — the same "derive it from the date" approach
    // already used on the frontend.
    private PaymentStatus effectiveStatus(Payment payment) {
        if (payment.getStatus() == PaymentStatus.PAID) {
            return PaymentStatus.PAID;
        }
        if (payment.getDueDate() != null && payment.getDueDate().isBefore(LocalDate.now())) {
            return PaymentStatus.OVERDUE;
        }
        return PaymentStatus.OUTSTANDING;
    }
}
