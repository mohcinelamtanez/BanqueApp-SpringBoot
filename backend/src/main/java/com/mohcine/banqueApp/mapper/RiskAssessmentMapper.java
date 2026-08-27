package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.entity.RiskAssessment;
import org.springframework.stereotype.Component;

/**
 * @author USER
 **/
@Component
public class RiskAssessmentMapper {

    public RiskAssessment toEntity(LoanCreateDto dto )  {

         RiskAssessment risk = new RiskAssessment();

         risk.setLevel(dto.getRiskLevel());
         risk.setScore(dto.getScore());

         return risk ;
    }
}
