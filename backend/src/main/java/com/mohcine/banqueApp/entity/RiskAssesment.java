package com.mohcine.banqueApp.entity;

import com.mohcine.banqueApp.enums.RiskLevel;
import jakarta.persistence.*;

import java.math.BigDecimal;

/**
 * @author USER
 **/
@Entity
@Table(name = "RiskAssesment" )
public class RiskAssesment {

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
}
