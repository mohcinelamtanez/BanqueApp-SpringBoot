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

        Map<String, Object> request = Map.of(
                "annualIncome", annualIncome,
                "monthlyPayment", monthlyPayment,
                "duration", duration,
                "annualInterestRate", annualInterestRate
        );

        return restClient.post()
                .uri("/predict")
                .body(request)
                .retrieve()
                .body(RiskAssessment.class);
    }
}