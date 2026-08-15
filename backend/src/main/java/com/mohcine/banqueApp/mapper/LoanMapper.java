package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.LoanResponseDTO;
import com.mohcine.banqueApp.entity.Loan;
import org.springframework.stereotype.Component;

/**
 * @author USER
 **/
@Component
public class LoanMapper {

    public LoanResponseDTO toDTO(Loan loan){
        LoanResponseDTO dto = new LoanResponseDTO();

        dto.setId(loan.getId());
        dto.setLoanAmount(loan.getLoanAmount());
        dto.setDuration(loan.getDuration());
        dto.setEndDate(loan.getEndDate());
        dto.setLoanType(loan.getLoanType());
        dto.setRiskLevel(loan.getRiskLevel());
        dto.setAnnualInterestRate(loan.getAnnualInterestRate());
        dto.setApprovalDate(loan.getApprovalDate());
        dto.setStatus(loan.getStatus());
        dto.setMonthlyPayment(loan.getMonthlyPayment());

        return dto;

    }
}
