package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.dto.LoanCreateDto;
import com.mohcine.banqueApp.dto.LoanUpdateDTO;
import com.mohcine.banqueApp.entity.Loan;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author USER
 **/

public interface LoanService {

   Loan createLoan(LoanCreateDto loan) ;

   void deleteLoan(Integer LoanId);

   Loan updateLoan(Integer id, LoanUpdateDTO dto);

   List<Loan> getAllLoans() ;

   List<Loan> getLoansByClientId(Integer clientId) ;

   List<Loan> getLoansByClientReference(String clientReference) ;

   Loan getLoanById(Integer loanId);

}
