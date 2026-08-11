package com.mohcine.banqueApp.service.interfaces;

import com.mohcine.banqueApp.entity.Loan;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author USER
 **/

public interface LoanService {

   Loan addLoan(Loan loan) ;

   void deleteLoan(Integer LoanId);

   Loan updateLoan(Loan loan);

   List<Loan> getAllLoans() ;

   List<Loan> getLoansByClientId(Integer clientId) ;

   Loan getLoanById(Integer loanId);

}
