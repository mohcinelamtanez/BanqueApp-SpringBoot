package com.mohcine.banqueApp.entity;

import com.mohcine.banqueApp.enums.RiskLevel;
import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * @author USER
 **/
@Entity
@Table(name = "RiskAssessment" )
public class RiskAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name= "risk_level" , nullable = false)
    private RiskLevel level;

    @Column(name = "score")
    private BigDecimal score;

    @OneToOne
    @JoinColumn(name = "loan_id", nullable = false, unique = true)
    private Loan loan;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public RiskLevel getLevel() {
        return level;
    }

    public void setLevel(RiskLevel level) {
        this.level = level;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public Loan getLoan() {
        return loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }
}
