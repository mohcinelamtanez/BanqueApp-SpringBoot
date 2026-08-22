package com.mohcine.banqueApp.dto;

import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.enums.LoanStatus;
import com.mohcine.banqueApp.enums.LoanType;
import com.mohcine.banqueApp.enums.RiskLevel;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * @author USER
 **/
public class LoanCreateDto {
    private LoanType loanType ;
    private BigDecimal loanAmount ;
    private Integer duration ;
    private BigDecimal annualInterestRate ;
    private BigDecimal monthlyPayment;
    private RiskLevel riskLevel;
    private LoanStatus status;
    private LocalDateTime approvalDate;
    private LocalDateTime endDate;
    private String rejectionReason ;
    private Client client ;

    public LoanType getLoanType() {
        return loanType;
    }

    public void setLoanType(LoanType loanType) {
        this.loanType = loanType;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public LocalDateTime getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(LocalDateTime approvalDate) {
        this.approvalDate = approvalDate;
    }

    public LoanStatus getStatus() {
        return status;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
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

    public Integer getDuration() {
        return duration;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason){
        this.rejectionReason = rejectionReason ;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
}
