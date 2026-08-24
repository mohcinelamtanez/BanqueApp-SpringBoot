package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.RiskAssessment;
import com.mohcine.banqueApp.service.interfaces.RiskModelClient;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.Map;

/**
 * @author USER
 **/
@Component
public class FlaskRiskModelClient implements RiskModelClient {

    private final RestClient restClient;

    public FlaskRiskModelClient(RestClient riskRestClient) {
        this.restClient = riskRestClient;
    }

    @Override
    public RiskAssessment predict(
            BigDecimal annualIncome,
            BigDecimal monthlyPayment,
            Integer duration,
            BigDecimal annualInterestRate) {
        System.out.println("annualIncome = " + annualIncome);
        System.out.println("monthlyPayment = " + monthlyPayment);
        System.out.println("duration = " + duration);
        System.out.println("annualInterestRate = " + annualInterestRate);
        Map<String, Object> request = Map.of(
                "revenu", annualIncome,
                "remboursement", monthlyPayment,
                "duree", duration,
                "taux", annualInterestRate
        );

        return restClient.post()
                .uri("/predict")
                .body(request)
                .retrieve()
                .body(RiskAssessment.class);
    }
}