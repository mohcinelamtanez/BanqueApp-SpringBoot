package com.mohcine.banqueApp.controller;

import com.mohcine.banqueApp.dto.RiskInputDTO;
import com.mohcine.banqueApp.dto.RiskPredictionResponseDTO;
import com.mohcine.banqueApp.entity.RiskAssessment;
import com.mohcine.banqueApp.service.interfaces.RiskService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

/**
 * @author USER
 **/
@RestController
@RequestMapping("api/v1/risk-assesments")
public class RiskController {

    RiskService riskService;

    public RiskController(RiskService riskService){
        this.riskService = riskService ;
    }

    @PostMapping("/calculate")
    public RiskPredictionResponseDTO calculateRisk(@RequestBody RiskInputDTO input) {
        return riskService.assessRisk(input) ;
    }
}
