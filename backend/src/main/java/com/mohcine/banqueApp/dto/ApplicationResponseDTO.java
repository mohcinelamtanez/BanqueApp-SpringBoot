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
        Integer clientId,
        LoanType loanType,
        BigDecimal requestedAmount,
        Integer requestedDuration,
        LocalDate applicationDate,
        ApplicationStatus status,
        String rejectionReason,
        // The Loan this application produced once decided (null while
        // PENDING) — lets the client UI check whether it's still Active or
        // has since become Completed.
        Integer loanId
) {
}
