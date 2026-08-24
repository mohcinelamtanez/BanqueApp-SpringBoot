package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.RiskAssessment;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public interface RiskService {
    RiskAssessment assessRisk(BigDecimal annualIncome,
                              BigDecimal monthlyPayment,
                              Integer duration,
                              BigDecimal annualInterestRate);
}
