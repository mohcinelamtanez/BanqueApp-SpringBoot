package com.mohcine.banqueApp.service.impl;

import com.mohcine.banqueApp.entity.Loan;
import com.mohcine.banqueApp.repository.LoanRepository;
import com.mohcine.banqueApp.service.interfaces.LoanService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author USER
 **/
@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;



    public LoanServiceImpl(LoanRepository loanRepository) {

        this.loanRepository = loanRepository;
    }

    @Override
    public Loan addLoan(Loan loan) {
        return loanRepository.save(loan);
    }

    @Override
    public void deleteLoan(Integer loanId) {
        loanRepository.deleteById(loanId);
    }



    @Override
    public Loan updateLoan(Loan loan) {
        return loanRepository.save(loan);
    }

    @Override
    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public List<Loan> getLoansByClientId(Integer clientId) {
        return loanRepository.findByClient_Id(clientId);
    }

    @Override
    public Loan getLoanById(Integer loanId) {
        return loanRepository.findById(loanId).orElse(null);
    }
}
