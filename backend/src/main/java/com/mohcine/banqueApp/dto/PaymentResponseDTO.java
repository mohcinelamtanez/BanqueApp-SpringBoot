package com.mohcine.banqueApp.dto;

import com.mohcine.banqueApp.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * @author USER
 **/
public record PaymentResponseDTO(
        Integer id,
        String paymentReference,
        Integer loanId,
        Integer installmentNumber,
        BigDecimal amount,
        LocalDate dueDate,
        LocalDate paymentDate,
        PaymentStatus status,
        String description
) {
}
