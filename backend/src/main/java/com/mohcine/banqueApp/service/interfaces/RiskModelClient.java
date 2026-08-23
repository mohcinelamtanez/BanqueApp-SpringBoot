package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.RiskAssessment;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public interface RiskModelClient {
    RiskAssessment predict(BigDecimal annualIncome , BigDecimal monthlyPayment , Integer Duration , BigDecimal annualInterestRate);
}
