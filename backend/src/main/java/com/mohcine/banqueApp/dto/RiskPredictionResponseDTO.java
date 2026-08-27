package com.mohcine.banqueApp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public class RiskPredictionResponseDTO {
    private String decision ;

    @JsonProperty ("score_risque")
    private BigDecimal scoreRisk ;

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public BigDecimal getScoreRisk() {
        return scoreRisk;
    }

    public void setScoreRisk(BigDecimal scoreRisk) {
        this.scoreRisk = scoreRisk;
    }
}
