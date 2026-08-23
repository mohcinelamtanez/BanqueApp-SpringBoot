package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.RiskAssessment;

/**
 * @author USER
 **/
public interface RiskService {
    RiskAssessment assessRisk(Integer loanId);
}
