package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.RiskInputDTO;
import com.mohcine.banqueApp.dto.RiskPredictionResponseDTO;
import com.mohcine.banqueApp.enums.RiskLevel;
import com.mohcine.banqueApp.exception.InvalidRiskInputException;
import com.mohcine.banqueApp.service.interfaces.RiskModelClient;
import com.mohcine.banqueApp.service.interfaces.RiskService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

/**
 * @author USER
 **/
@Service
public class RiskServiceImpl implements RiskService {

    // The model's own verdict ("RISQUE_ELEVE", predicted class 1) always
    // wins: a client the model flags as high risk is HIGH, whatever the
    // score. Only a "RISQUE_FAIBLE" verdict is split further, by score.
    static final String HIGH_RISK_DECISION = "RISQUE_ELEVE";
    static final BigDecimal MEDIUM_RISK_THRESHOLD = new BigDecimal("0.30");

    private final RiskModelClient riskModelClient;

    public RiskServiceImpl(RiskModelClient riskModelClient) {
        this.riskModelClient = riskModelClient;
    }


    @Override
    public RiskPredictionResponseDTO assessRisk(RiskInputDTO input) {
        validate(input);

        RiskPredictionResponseDTO prediction = riskModelClient.predict(
                input.getMonthlyIncome(),
                input.getMonthlyPayment(),
                input.getDuration(),
                input.getAnnualInterestRate()
        );
        if (prediction == null || prediction.getScoreRisk() == null || prediction.getDecision() == null) {
            throw new IllegalStateException("The risk model returned an incomplete prediction.");
        }
        prediction.setRiskLevel(levelFor(prediction.getDecision(), prediction.getScoreRisk()));
        return prediction;
    }

    static RiskLevel levelFor(String decision, BigDecimal score) {
        if (HIGH_RISK_DECISION.equals(decision)) {
            return RiskLevel.HIGH;
        }
        return score.compareTo(MEDIUM_RISK_THRESHOLD) < 0 ? RiskLevel.LOW : RiskLevel.MEDIUM;
    }

    // The model was trained on real, positive values (ml-model/data) — a
    // missing or zero field would still get a score, just a meaningless one.
    private void validate(RiskInputDTO input) {
        if (input == null
                || input.getMonthlyPayment() == null
                || input.getDuration() == null
                || input.getAnnualInterestRate() == null) {
            throw new InvalidRiskInputException(
                    "Monthly payment, duration and interest rate are required to assess risk.");
        }
        if (input.getMonthlyIncome() == null || input.getMonthlyIncome().signum() <= 0) {
            throw new InvalidRiskInputException(
                    "The client's income is missing — complete the client profile before assessing risk.");
        }
        if (input.getMonthlyPayment().signum() <= 0
                || input.getDuration() <= 0
                || input.getAnnualInterestRate().signum() <= 0) {
            throw new InvalidRiskInputException(
                    "Monthly payment, duration and interest rate must be positive.");
        }
    }
}
