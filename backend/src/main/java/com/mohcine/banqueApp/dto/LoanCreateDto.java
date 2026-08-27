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

    private Integer clientId ;
    private LoanType loanType ;
    private BigDecimal loanAmount ;
    private Integer duration ;
    private BigDecimal annualInterestRate ;
    private BigDecimal monthlyPayment;
    private RiskLevel riskLevel;
    private BigDecimal score;
    private LoanStatus status;
    private LocalDateTime approvalDate;
    private LocalDateTime endDate;
    private String rejectionReason ;


    public LoanType getLoanType() {
        return loanType;
    }

    public void setLoanType(LoanType loanType) {
        this.loanType = loanType;
    }

        public Integer getClientId() {
        return clientId;
    }

    public void setClient(Integer clientId) {
        this.clientId = clientId;
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


    public BigDecimal getScore() {
        return this.score ;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }


}

