package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Client;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.RiskAssessment;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.repository.RiskAssessmentRepository;
import com.mohcine.banqueApp.service.interfaces.RiskModelClient;
import com.mohcine.banqueApp.service.interfaces.RiskService;
import org.springframework.stereotype.Service;

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
    public RiskAssessment assessRisk(Integer loanId) {

        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() ->
                        new RuntimeException("Loan not found"));

        Client client = loan.getClient();

        RiskAssessment assessment = riskModelClient.predict(
                client.getAnnualIncome(),
                loan.getMonthlyPayment(),
                loan.getDuration(),
                loan.getAnnualInterestRate()
        );

        assessment.setLoan(loan);

        return riskAssessmentRepository.save(assessment);
    }
}