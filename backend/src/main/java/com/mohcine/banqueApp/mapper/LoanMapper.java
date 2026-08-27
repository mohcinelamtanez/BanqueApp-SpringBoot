package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.dto.LoanResponseDTO;
import com.mohcine.banqueApp.dto.LoanUpdateDTO;
import com.mohcine.banqueApp.entity.Loan;
import org.springframework.stereotype.Component;

/**
 * @author USER
 **/
@Component
public class LoanMapper {

    public Loan toEntity(LoanCreateDto loanCreateDto) {
        Loan loan = new Loan();


        loan.setLoanAmount(loanCreateDto.getLoanAmount());
        loan.setDuration(loanCreateDto.getDuration());
        loan.setEndDate(loanCreateDto.getEndDate());
        loan.setLoanType(loanCreateDto.getLoanType());
        loan.setAnnualInterestRate(loanCreateDto.getAnnualInterestRate());
        loan.setApprovalDate(loanCreateDto.getApprovalDate());
        loan.setStatus(loanCreateDto.getStatus());
        loan.setMonthlyPayment(loanCreateDto.getMonthlyPayment());
        loan.setRejectionReason(loanCreateDto.getRejectionReason());
        return loan  ;
    }


















    public LoanResponseDTO toDTO(Loan loan){
          LoanResponseDTO dto = new LoanResponseDTO();

            dto.setId(loan.getId());
            dto.setLoanAmount(loan.getLoanAmount());
            dto.setDuration(loan.getDuration());
            dto.setEndDate(loan.getEndDate());
            dto.setLoanType(loan.getLoanType());
            dto.setAnnualInterestRate(loan.getAnnualInterestRate());
            dto.setApprovalDate(loan.getApprovalDate());
            dto.setStatus(loan.getStatus());
            dto.setMonthlyPayment(loan.getMonthlyPayment());
            dto.setRejectionReason(loan.getRejectionReason());
           return dto;

   }






    public Loan updateEntity(LoanUpdateDTO loanUpdateDTO) {
        Loan loan = new Loan();

        loan.setLoanAmount(loanUpdateDTO.getLoanAmount());
        loan.setDuration(loanUpdateDTO.getDuration());
        loan.setEndDate(loanUpdateDTO.getEndDate());
        loan.setLoanType(loanUpdateDTO.getLoanType());
        loan.setAnnualInterestRate(loanUpdateDTO.getAnnualInterestRate());
        loan.setApprovalDate(loanUpdateDTO.getApprovalDate());
        loan.setStatus(loanUpdateDTO.getStatus());
        loan.setMonthlyPayment(loanUpdateDTO.getMonthlyPayment());
        loan.setRejectionReason(loanUpdateDTO.getRejectionReason());
       // loan.setClientId(loanUpdateDTO.getClientId());

        return loan  ;
    }
}
