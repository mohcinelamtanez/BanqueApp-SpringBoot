package com.mohcine.banqueApp.mapper;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.dto.LoanResponseDTO;
import com.mohcine.banqueApp.dto.LoanUpdateDTO;
import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.entity.RiskAssessment;
import com.mohcine.banqueApp.repository.RiskAssessmentRepository;
import org.springframework.stereotype.Component;

/**
 * @author USER
 **/
@Component
public class LoanMapper {

    private final RiskAssessmentRepository riskAssessmentRepository;

    public LoanMapper(RiskAssessmentRepository riskAssessmentRepository) {
        this.riskAssessmentRepository = riskAssessmentRepository;
    }

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
            if (loan.getClient() != null) {
                dto.setClientReference(loan.getClient().getClientReference());
            }
            dto.setLoanAmount(loan.getLoanAmount());
            dto.setDuration(loan.getDuration());
            dto.setEndDate(loan.getEndDate());
            dto.setLoanType(loan.getLoanType());
            dto.setAnnualInterestRate(loan.getAnnualInterestRate());
            dto.setApprovalDate(loan.getApprovalDate());
            dto.setStatus(loan.getStatus());
            dto.setMonthlyPayment(loan.getMonthlyPayment());
            dto.setRejectionReason(loan.getRejectionReason());
            RiskAssessment risk = riskAssessmentRepository.findByLoan_Id(loan.getId());
            if (risk != null) {
                dto.setRiskLevel(risk.getLevel());
            }
           return dto;

   }






    // Mutates the existing loan in place — updateLoan must fetch it by id
    // first (see LoanServiceImpl), otherwise saving a fresh, id-less Loan
    // would INSERT a duplicate row instead of updating the original one.
    public void updateEntity(LoanUpdateDTO loanUpdateDTO, Loan loan) {
        if (loanUpdateDTO.getLoanAmount() != null) {
            loan.setLoanAmount(loanUpdateDTO.getLoanAmount());
        }
        if (loanUpdateDTO.getDuration() != null) {
            loan.setDuration(loanUpdateDTO.getDuration());
        }
        if (loanUpdateDTO.getEndDate() != null) {
            loan.setEndDate(loanUpdateDTO.getEndDate());
        }
        if (loanUpdateDTO.getLoanType() != null) {
            loan.setLoanType(loanUpdateDTO.getLoanType());
        }
        if (loanUpdateDTO.getAnnualInterestRate() != null) {
            loan.setAnnualInterestRate(loanUpdateDTO.getAnnualInterestRate());
        }
        if (loanUpdateDTO.getApprovalDate() != null) {
            loan.setApprovalDate(loanUpdateDTO.getApprovalDate());
        }
        if (loanUpdateDTO.getStatus() != null) {
            loan.setStatus(loanUpdateDTO.getStatus());
        }
        if (loanUpdateDTO.getMonthlyPayment() != null) {
            loan.setMonthlyPayment(loanUpdateDTO.getMonthlyPayment());
        }
        if (loanUpdateDTO.getRejectionReason() != null) {
            loan.setRejectionReason(loanUpdateDTO.getRejectionReason());
        }
    }
}
