package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.dto.RiskPredictionResponseDTO;
import com.mohcine.banqueApp.entity.RiskAssessment;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public interface RiskModelClient {
    RiskPredictionResponseDTO predict(BigDecimal annualIncome , BigDecimal monthlyPayment , Integer Duration , BigDecimal annualInterestRate);
}
