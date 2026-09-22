package com.mohcine.banqueApp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mohcine.banqueApp.enums.RiskLevel;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public class RiskPredictionResponseDTO {
    private String decision ;

    @JsonProperty ("score_risque")
    private BigDecimal scoreRisk ;

    // Not returned by the Flask model — derived by RiskServiceImpl from
    // decision + score, so the level shown/stored is never at odds with the
    // model's own verdict.
    private RiskLevel riskLevel ;

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

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }
}
