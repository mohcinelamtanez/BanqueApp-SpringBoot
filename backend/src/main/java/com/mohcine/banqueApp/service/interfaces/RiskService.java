package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.dto.RiskInputDTO;
import com.mohcine.banqueApp.dto.RiskPredictionResponseDTO;
import com.mohcine.banqueApp.entity.RiskAssessment;

import java.math.BigDecimal;

/**
 * @author USER
 **/
public interface RiskService {
    RiskPredictionResponseDTO assessRisk(RiskInputDTO input);
}
