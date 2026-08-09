package com.mohcine.banqueApp.entity;
import com.mohcine.banqueApp.entity.*;
import com.mohcine.banqueApp.enums.*;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity

@Table(name = "pret")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "TypePret", length = 50)
    private LoanType loanType;

    @Column(name = "MontantPret", nullable = false, precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(name = "Duree", nullable = false)
    private Integer duration;

    @Column(name = "TauxAnnuel", nullable = false, precision = 5, scale = 2)
    private BigDecimal annualInterestRate;

    @Column(name = "Mensualite", precision = 15, scale = 2)
    private BigDecimal monthlyPayment;

    @Enumerated(EnumType.STRING)
    @Column(name = "NiveauRisque", length = 50)
    private RiskLevel riskLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "Statut", length = 50)
    private LoanStatus status;

    @Column(name = "DateAccord")
    private LocalDateTime approvalDate;

    @Column(name = "DateFin")
    private LocalDateTime endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ClientId", nullable = false)
    private Client client;

    public Loan() {
    }

    public Loan(LoanType loanType,
                BigDecimal loanAmount,
                Integer duration,
                BigDecimal annualInterestRate,
                Client client) {

        this.loanType = loanType;
        this.loanAmount = loanAmount;
        this.duration = duration;
        this.annualInterestRate = annualInterestRate;
        this.client = client;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LoanType getLoanType() {
        return loanType;
    }

    public void setLoanType(LoanType loanType) {
        this.loanType = loanType;
    }

    public BigDecimal getLoanAmount() {
        return loanAmount;
    }

    public void setLoanAmount(BigDecimal loanAmount) {
        this.loanAmount = loanAmount;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
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

    public LoanStatus getStatus() {
        return status;
    }

    public void setStatus(LoanStatus status) {
        this.status = status;
    }

    public LocalDateTime getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(LocalDateTime approvalDate) {
        this.approvalDate = approvalDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }


}