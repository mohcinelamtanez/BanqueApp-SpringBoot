package com.mohcine.banqueApp.entity;
import com.mohcine.banqueApp.entity.*;
import com.mohcine.banqueApp.enums.*;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "loan")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "loan_type", length = 50)
    private LoanType loanType;

    @Column(name = "loan_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal loanAmount;

    @Column(nullable = false)
    private Integer duration;

    @Column(name = "annual_interest_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal annualInterestRate;

    @Column(name = "monthly_payment", precision = 15, scale = 2)
    private BigDecimal monthlyPayment;


    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private LoanStatus status;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "rejection_reason" , nullable = true , length = 255)
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @OneToMany(mappedBy = "loan")
    private List<Payment> payments;

    public Loan() {
    }

    public Loan(
            LoanType loanType,
            BigDecimal loanAmount,
            Integer duration,
            BigDecimal annualInterestRate,
            Client client
    ) {
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

    public String getRejectionReason() {
        return this.rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public List<Payment> getPayments(){
        return this.payments ;
    }

    public void setPayment(List<Payment> payments ){
        this.payments = payments ;
    }

    public void setClient(Client client) {
        this.client = client;
    }
}