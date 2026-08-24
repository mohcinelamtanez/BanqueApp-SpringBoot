package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.RiskAssessment;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.repository.RiskAssessmentRepository;
import com.mohcine.banqueApp.service.interfaces.RiskModelClient;
import com.mohcine.banqueApp.service.interfaces.RiskService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * @author USER
 **/
@Service
public class RiskServiceImpl implements RiskService {

    private final LoanRepository loanRepository;
    private final RiskModelClient riskModelClient;
    private final RiskAssessmentRepository riskAssessmentRepository;

    public RiskServiceImpl(
            LoanRepository loanRepository,
            RiskModelClient riskModelClient,
            RiskAssessmentRepository riskAssessmentRepository) {
        this.loanRepository = loanRepository;
        this.riskModelClient = riskModelClient;
        this.riskAssessmentRepository = riskAssessmentRepository;
    }


    @Override
    public RiskAssessment assessRisk(
            BigDecimal annualIncome,
            BigDecimal monthlyPayment,
            Integer duration,
            BigDecimal annualInterestRate) {

        return riskModelClient.predict(
                annualIncome,
                monthlyPayment,
                duration,
                annualInterestRate
        );
    }
}