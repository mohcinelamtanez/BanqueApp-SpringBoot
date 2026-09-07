package com.mohcine.banqueApp.dto;

import com.mohcine.banqueApp.enums.LoanType;

import java.math.BigDecimal;

/**
 * The submitting client is never taken from this payload — the controller
 * derives it from the authenticated user, so a client can never submit an
 * application on someone else's behalf.
 *
 * @author USER
 **/
public class ApplicationCreateDto {

    private LoanType loanType;
    private BigDecimal requestedAmount;
    private Integer requestedDuration;

    public LoanType getLoanType() {
        return loanType;
    }

    public void setLoanType(LoanType loanType) {
        this.loanType = loanType;
    }

    public BigDecimal getRequestedAmount() {
        return requestedAmount;
    }

    public void setRequestedAmount(BigDecimal requestedAmount) {
        this.requestedAmount = requestedAmount;
    }

    public Integer getRequestedDuration() {
        return requestedDuration;
    }

    public void setRequestedDuration(Integer requestedDuration) {
        this.requestedDuration = requestedDuration;
    }
}
