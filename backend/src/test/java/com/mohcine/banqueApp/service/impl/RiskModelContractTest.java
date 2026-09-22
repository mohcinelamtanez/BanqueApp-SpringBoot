package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.dto.RiskInputDTO;
import com.mohcine.banqueApp.dto.RiskPredictionResponseDTO;
import com.mohcine.banqueApp.enums.RiskLevel;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

/**
 * Frontend -> backend -> Flask data contract for "Calculate Risk".
 *
 * Starts from the exact JSON body frontend/src/services/riskService.js
 * sends, and checks that what reaches the model is exactly what
 * ml-model/app.py reads (revenu, remboursement, duree, taux — the
 * ml-model/data/prets.csv columns, in the same units), then that the
 * model's answer comes back in the shape the frontend reads.
 */
class RiskModelContractTest {

    private final JsonMapper json = JsonMapper.builder().build();

    // Client annualIncome 36 000 MAD, loan 10 000 MAD over 24 months at
    // 2.5 %, as computed by the frontend:
    //   monthlyIncome  = 36000 / 12                                   = 3000
    //   monthlyPayment = loanSummary(): (10000 + 10000*2.5%*2) / 24   = 437.5
    private static final String FRONTEND_BODY =
            "{\"monthlyIncome\":3000,\"monthlyPayment\":437.5,\"duration\":24,\"annualInterestRate\":2.5}";

    // What the model was trained on: monthly income, monthly payment,
    // duration in months, annual rate in percent (e.g. 1.168, not 0.01168).
    private static final String EXPECTED_MODEL_BODY =
            "{\"revenu\":3000,\"remboursement\":437.5,\"duree\":24,\"taux\":2.5}";

    @Test
    void frontendPayloadReachesTheModelUnchangedAndInTheExpectedShape() throws Exception {
        // 1. Frontend JSON -> backend DTO: every field name must bind.
        RiskInputDTO input = json.readValue(FRONTEND_BODY, RiskInputDTO.class);
        assertThat(input.getMonthlyIncome()).isEqualByComparingTo("3000");
        assertThat(input.getMonthlyPayment()).isEqualByComparingTo("437.5");
        assertThat(input.getDuration()).isEqualTo(24);
        assertThat(input.getAnnualInterestRate()).isEqualByComparingTo("2.5");

        // 2. Backend -> Flask: exact keys and values app.py reads.
        RestClient.Builder builder = RestClient.builder().baseUrl("http://localhost:5000");
        MockRestServiceServer flask = MockRestServiceServer.bindTo(builder).build();
        flask.expect(requestTo("http://localhost:5000/predict"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().json(EXPECTED_MODEL_BODY, JsonCompareMode.STRICT))
                .andRespond(withSuccess(
                        "{\"score_risque\":0.12,\"decision\":\"RISQUE_FAIBLE\"}",
                        MediaType.APPLICATION_JSON));

        RiskServiceImpl riskService = new RiskServiceImpl(new FlaskRiskModelClient(builder.build()));
        RiskPredictionResponseDTO prediction = riskService.assessRisk(input);
        flask.verify();

        // 3. Flask answer -> backend -> frontend: the keys riskService.js reads.
        assertThat(prediction.getScoreRisk()).isEqualByComparingTo("0.12");
        assertThat(prediction.getDecision()).isEqualTo("RISQUE_FAIBLE");
        assertThat(prediction.getRiskLevel()).isEqualTo(RiskLevel.LOW);

        JsonNode response = json.readTree(json.writeValueAsString(prediction));
        assertThat(response.get("score_risque").asDouble()).isEqualTo(0.12);
        assertThat(response.get("decision").asString()).isEqualTo("RISQUE_FAIBLE");
        assertThat(response.get("riskLevel").asString()).isEqualTo("LOW");
    }
}
