package com.mohcine.banqueApp.entity;

import com.mohcine.banqueApp.enums.PaymentStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
/**
 * @author USER
 **/

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @Column(name = "installment_number" , nullable = true)
    private Integer installmentNumber;

    @Column(name = "amount"  , nullable = true, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(name = "due_date"  , nullable = true)
    private LocalDate dueDate;

    @Column(name = "payment_date" ,  nullable = true)
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status" , nullable = true)
    private PaymentStatus status;

    @Column(name = "description" , length = 500)
    private String description;

    public Payment() {
    }

    public Payment(
            Loan loan,
            Integer installmentNumber,
            BigDecimal amount,
            LocalDate dueDate,
            PaymentStatus status
    ) {
        this.loan = loan;
        this.installmentNumber = installmentNumber;
        this.amount = amount;
        this.dueDate = dueDate;
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }

    public Integer getInstallmentNumber() {
        return installmentNumber;
    }

    public void setInstallmentNumber(Integer installmentNumber) {
        this.installmentNumber = installmentNumber;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}