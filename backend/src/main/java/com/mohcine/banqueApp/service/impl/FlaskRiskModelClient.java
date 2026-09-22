package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.RiskPredictionResponseDTO;
import com.mohcine.banqueApp.exception.RiskModelUnavailableException;
import com.mohcine.banqueApp.service.interfaces.RiskModelClient;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

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
    public RiskPredictionResponseDTO predict(
            BigDecimal monthlyIncome,
            BigDecimal monthlyPayment,
            Integer duration,
            BigDecimal annualInterestRate) {

        Map<String, Object> request = Map.of(
                "revenu", monthlyIncome,
                "remboursement", monthlyPayment,
                "duree", duration,
                "taux", annualInterestRate
        );

        try {
            return restClient.post()
                    .uri("/predict")
                    .body(request)
                    .retrieve()
                    .body(RiskPredictionResponseDTO.class);
        } catch (RestClientException e) {
            throw new RiskModelUnavailableException(
                    "The risk model is unavailable right now. Please try again in a moment.");
        }

    }
}