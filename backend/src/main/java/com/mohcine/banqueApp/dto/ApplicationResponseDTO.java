package com.mohcine.banqueApp.dto;

import com.mohcine.banqueApp.enums.ApplicationStatus;
import com.mohcine.banqueApp.enums.LoanType;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * @author USER
 **/
public record ApplicationResponseDTO(
        Integer id,
        String clientReference,
        LoanType loanType,
        BigDecimal requestedAmount,
        Integer requestedDuration,
        LocalDate applicationDate,
        ApplicationStatus status,
        String rejectionReason
) {
}
