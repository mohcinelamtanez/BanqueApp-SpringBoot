package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.RiskInputDTO;
import com.mohcine.banqueApp.dto.RiskPredictionResponseDTO;
import com.mohcine.banqueApp.enums.RiskLevel;
import com.mohcine.banqueApp.exception.InvalidRiskInputException;
import com.mohcine.banqueApp.service.interfaces.RiskModelClient;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * The risk level must never contradict the model's own verdict.
 */
class RiskServiceImplTest {

    private final RiskModelClient modelClient = mock(RiskModelClient.class);
    private final RiskServiceImpl riskService = new RiskServiceImpl(modelClient);

    private static RiskInputDTO validInput() {
        RiskInputDTO input = new RiskInputDTO();
        input.setMonthlyIncome(new BigDecimal("3000"));
        input.setMonthlyPayment(new BigDecimal("450"));
        input.setDuration(24);
        input.setAnnualInterestRate(new BigDecimal("2.5"));
        return input;
    }

    private RiskLevel levelReturnedFor(String decision, String score) {
        RiskPredictionResponseDTO prediction = new RiskPredictionResponseDTO();
        prediction.setDecision(decision);
        prediction.setScoreRisk(new BigDecimal(score));
        when(modelClient.predict(any(), any(), any(), any())).thenReturn(prediction);
        return riskService.assessRisk(validInput()).getRiskLevel();
    }

    @Test
    void highRiskVerdictIsAlwaysHigh() {
        // 52 % used to be shown as "MEDIUM" next to a "RISQUE_ELEVE" verdict.
        assertThat(levelReturnedFor("RISQUE_ELEVE", "0.52")).isEqualTo(RiskLevel.HIGH);
        assertThat(levelReturnedFor("RISQUE_ELEVE", "0.99")).isEqualTo(RiskLevel.HIGH);
    }

    @Test
    void lowRiskVerdictIsSplitByScore() {
        assertThat(levelReturnedFor("RISQUE_FAIBLE", "0.05")).isEqualTo(RiskLevel.LOW);
        assertThat(levelReturnedFor("RISQUE_FAIBLE", "0.2999")).isEqualTo(RiskLevel.LOW);
        assertThat(levelReturnedFor("RISQUE_FAIBLE", "0.30")).isEqualTo(RiskLevel.MEDIUM);
        assertThat(levelReturnedFor("RISQUE_FAIBLE", "0.49")).isEqualTo(RiskLevel.MEDIUM);
    }

    @Test
    void missingOrZeroIncomeIsRefusedBeforeCallingTheModel() {
        RiskInputDTO noIncome = validInput();
        noIncome.setMonthlyIncome(BigDecimal.ZERO);
        assertThatThrownBy(() -> riskService.assessRisk(noIncome))
                .isInstanceOf(InvalidRiskInputException.class);

        RiskInputDTO noRate = validInput();
        noRate.setAnnualInterestRate(null);
        assertThatThrownBy(() -> riskService.assessRisk(noRate))
                .isInstanceOf(InvalidRiskInputException.class);

        verify(modelClient, never()).predict(any(), any(), any(), any());
    }
}
