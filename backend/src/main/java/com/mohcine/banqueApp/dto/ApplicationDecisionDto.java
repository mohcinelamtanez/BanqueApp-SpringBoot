package com.mohcine.banqueApp.dto;

import com.mohcine.banqueApp.enums.ApplicationStatus;
import com.mohcine.banqueApp.enums.RiskLevel;

import java.math.BigDecimal;

/**
 * The Admin/Bank Agent decision on a PENDING Application. Only status is
 * required for a REJECTED decision (plus an optional rejectionReason); an
 * APPROVED decision also needs the loan terms being granted — mirroring the
 * exact fields LoanCreateDto already expects, since approving an
 * Application results in a real Loan via the existing LoanService.
 *
 * @author USER
 **/
public class ApplicationDecisionDto {

    private ApplicationStatus status;
    private String rejectionReason;
    private BigDecimal annualInterestRate;
    private BigDecimal monthlyPayment;
    private RiskLevel riskLevel;
    private BigDecimal score;

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public BigDecimal getAnnualInterestRate() {
        return annualInterestRate;
    }

    public void setAnnualInterestRate(BigDecimal annualInterestRate) {
        this.annualInterestRate = annualInterestRate;
    }

    public BigDecimal getMonthlyPayment() {
        return monthlyPayment;
    }

    public void setMonthlyPayment(BigDecimal monthlyPayment) {
        this.monthlyPayment = monthlyPayment;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }
}
