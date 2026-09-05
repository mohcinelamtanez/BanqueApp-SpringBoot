package com.mohcine.banqueApp.exception;

/**
 * @author USER
 **/
public class LoanNotFoundException extends RuntimeException {
    public LoanNotFoundException(Integer loanId) {
        super("Loan not found with id " + loanId);
    }
}
